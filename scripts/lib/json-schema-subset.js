'use strict';

/**
 * Minimal JSON Schema (draft 2020-12) validator with zero dependencies.
 *
 * Supports only the keywords the repository schemas use: `type`, `const`,
 * `enum`, `required`, `properties`, `additionalProperties`, `items`,
 * `minItems`, `uniqueItems`, `minLength`, `minimum`, `pattern`, `format`
 * (`date`, `date-time`) and local `$ref` (`#/$defs/<name>`). Any other
 * keyword in a schema is reported as unsupported instead of being ignored,
 * so a schema change cannot silently weaken validation.
 */

/** Keywords that carry no validation rule. */
const ANNOTATION_KEYWORDS = new Set(['$schema', '$id', '$defs', 'title', 'description']);
const SUPPORTED_KEYWORDS = new Set([
  'type', 'const', 'enum', 'required', 'properties', 'additionalProperties', 'items',
  'minItems', 'uniqueItems', 'minLength', 'minimum', 'pattern', 'format', '$ref',
]);
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const DATE_TIME_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$/;
const LOCAL_REFERENCE_PREFIX = '#/$defs/';

/**
 * Returns the JSON Schema type name of a value.
 *
 * @param {unknown} value Value to classify.
 * @returns {string} One of null, array, integer, number, string, boolean, object.
 */
function jsonTypeOf(value) {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  if (Number.isInteger(value)) return 'integer';
  return typeof value;
}

/**
 * Checks whether a value matches one JSON Schema type name.
 *
 * @param {unknown} value Value to check.
 * @param {string} typeName Schema type name.
 * @returns {boolean} True when the value matches.
 */
function matchesType(value, typeName) {
  const actualType = jsonTypeOf(value);
  if (typeName === 'number') return actualType === 'number' || actualType === 'integer';
  return actualType === typeName;
}

/**
 * Validates data against a schema and returns every violation found.
 *
 * @param {object} rootSchema Schema whose `$defs` resolve local references.
 * @param {unknown} data Data to validate.
 * @returns {string[]} Violations as `<json-pointer>: <message>`; empty when valid.
 */
function validateSchema(rootSchema, data) {
  const errors = [];

  const resolveReference = (reference, pointer) => {
    if (!reference.startsWith(LOCAL_REFERENCE_PREFIX)) {
      errors.push(`${pointer}: unsupported $ref '${reference}'`);
      return null;
    }
    const definition = (rootSchema.$defs || {})[reference.slice(LOCAL_REFERENCE_PREFIX.length)];
    if (!definition) errors.push(`${pointer}: unknown $ref '${reference}'`);
    return definition || null;
  };

  const visit = (schema, value, pointer) => {
    for (const keyword of Object.keys(schema)) {
      if (!SUPPORTED_KEYWORDS.has(keyword) && !ANNOTATION_KEYWORDS.has(keyword)) {
        errors.push(`${pointer}: unsupported schema keyword '${keyword}'`);
      }
    }
    if (schema.$ref) {
      const definition = resolveReference(schema.$ref, pointer);
      if (definition) visit(definition, value, pointer);
    }
    if (schema.type !== undefined) {
      const allowedTypes = Array.isArray(schema.type) ? schema.type : [schema.type];
      if (!allowedTypes.some((typeName) => matchesType(value, typeName))) {
        errors.push(`${pointer}: expected type ${allowedTypes.join('|')}, got ${jsonTypeOf(value)}`);
        return;
      }
    }
    if ('const' in schema && JSON.stringify(value) !== JSON.stringify(schema.const)) {
      errors.push(`${pointer}: expected constant ${JSON.stringify(schema.const)}`);
    }
    if (schema.enum && !schema.enum.some((allowed) => JSON.stringify(allowed) === JSON.stringify(value))) {
      errors.push(`${pointer}: ${JSON.stringify(value)} is not one of ${JSON.stringify(schema.enum)}`);
    }
    if (typeof value === 'string') {
      if (schema.minLength !== undefined && value.length < schema.minLength) {
        errors.push(`${pointer}: shorter than ${schema.minLength} characters`);
      }
      if (schema.pattern && !new RegExp(schema.pattern, 'u').test(value)) {
        errors.push(`${pointer}: '${value}' does not match ${schema.pattern}`);
      }
      if (schema.format === 'date' && !DATE_PATTERN.test(value)) {
        errors.push(`${pointer}: '${value}' is not a date (YYYY-MM-DD)`);
      }
      if (schema.format === 'date-time' && !(DATE_TIME_PATTERN.test(value) && !Number.isNaN(Date.parse(value)))) {
        errors.push(`${pointer}: '${value}' is not an ISO-8601 date-time`);
      }
    }
    if (typeof value === 'number' && schema.minimum !== undefined && value < schema.minimum) {
      errors.push(`${pointer}: ${value} is below the minimum ${schema.minimum}`);
    }
    if (Array.isArray(value)) {
      if (schema.minItems !== undefined && value.length < schema.minItems) {
        errors.push(`${pointer}: expected at least ${schema.minItems} items, got ${value.length}`);
      }
      if (schema.uniqueItems) {
        const serializedItems = value.map((item) => JSON.stringify(item));
        if (new Set(serializedItems).size !== serializedItems.length) errors.push(`${pointer}: items are not unique`);
      }
      if (schema.items) value.forEach((item, index) => visit(schema.items, item, `${pointer}/${index}`));
    }
    if (jsonTypeOf(value) === 'object') {
      for (const requiredKey of schema.required || []) {
        if (!(requiredKey in value)) errors.push(`${pointer}: missing required property '${requiredKey}'`);
      }
      const declaredProperties = schema.properties || {};
      for (const [key, propertyValue] of Object.entries(value)) {
        const propertyPointer = `${pointer}/${key}`;
        if (declaredProperties[key]) {
          visit(declaredProperties[key], propertyValue, propertyPointer);
        } else if (schema.additionalProperties === false) {
          errors.push(`${pointer}: property '${key}' is not declared in the schema`);
        } else if (typeof schema.additionalProperties === 'object') {
          visit(schema.additionalProperties, propertyValue, propertyPointer);
        }
      }
    }
  };

  visit(rootSchema, data, '');
  return errors;
}

module.exports = { validateSchema };
