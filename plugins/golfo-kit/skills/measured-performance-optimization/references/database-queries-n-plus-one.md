# Queries lentas y N+1

## Qué es el problema N+1

Se hace 1 query para traer una lista y después 1 query más por cada elemento de esa lista.

Ejemplo: traer 100 usuarios y sus pedidos.

```sql
-- 1 query para los usuarios
SELECT id, name FROM users LIMIT 100;

-- + 100 queries, una por usuario
SELECT * FROM orders WHERE user_id = 1;
SELECT * FROM orders WHERE user_id = 2;
-- ... hasta user_id = 100
```

Son 101 queries cuando con 1 o 2 alcanza. El costo crece linealmente con la cantidad de items: con 1.000 usuarios son 1.001 viajes a la base, cada uno con su latencia de red, parseo y pool de conexiones ocupado. En desarrollo, con poca data y la base local, no se nota; en producción, sí.

## Detectar

- Log de queries del ORM durante un request: muchas queries con la misma forma y distinto parámetro.
- Sentry: issue de tipo "N+1 Query" o spans `db` repetidos dentro de una transacción.
- Señales en el código: queries o llamadas remotas dentro de `for`, `map`, `forEach`, resolvers de GraphQL por campo, serializers, getters lazy del ORM (`user.orders` en un loop) o render de componentes server que hacen fetch por item.
- Un endpoint cuyo tiempo crece proporcionalmente con el tamaño de la página.

## Corregir

Elegir según el caso:

**JOIN** — una sola query, conveniente cuando se necesitan columnas de ambas tablas y la relación no multiplica demasiado las filas:

```sql
SELECT u.id, u.name, o.id AS order_id, o.total
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
WHERE u.id IN (SELECT id FROM users LIMIT 100);
```

**WHERE IN** — dos queries, conveniente cuando el JOIN duplicaría muchas filas o los datos vienen de servicios distintos; después se agrupa en memoria con un `Map`:

```sql
SELECT id, name FROM users LIMIT 100;
SELECT * FROM orders WHERE user_id IN (1, 2, ..., 100);
```

**Equivalentes en ORMs y APIs**:

- Eager loading: Prisma `include`, TypeORM `relations`/`leftJoinAndSelect`, Sequelize `include`, Django `select_related`/`prefetch_related`, Rails `includes`, Hibernate `JOIN FETCH`/`@BatchSize`, GORM `Preload`.
- GraphQL o llamadas remotas por item: DataLoader (batch + cache por request) o un endpoint batch.

Cuidar listas de `IN` muy grandes (partir en chunks) y no traer relaciones que la vista no usa.

## Queries lentas que no son N+1

- `EXPLAIN ANALYZE` de la query: buscar seq scans sobre tablas grandes, sorts en disco y estimaciones de filas muy erradas.
  - `EXPLAIN ANALYZE` ejecuta la sentencia de verdad. Para `INSERT`/`UPDATE`/`DELETE` usar `EXPLAIN` sin `ANALYZE`, o envolverlo en una transacción revertida (`BEGIN; EXPLAIN ANALYZE ...; ROLLBACK;`), preferentemente fuera de producción.
- Índices sobre columnas de `WHERE`, `JOIN` y `ORDER BY` (índices compuestos en el orden en que se filtra).
- Paginación por cursor/keyset en lugar de `OFFSET` grande.
- Proyectar solo las columnas necesarias en lugar de `SELECT *`.
- Mover filtros, sorts y agregaciones a la base en lugar de hacerlos en memoria.

## Métricas antes/después

- Cantidad de queries por request (por ejemplo, 101 → 2).
- Tiempo total de DB y p95 del endpoint con la misma data.
- Plan de `EXPLAIN ANALYZE` y tiempo de ejecución de la query (en sentencias de escritura, ver la advertencia de [Queries lentas que no son N+1](#queries-lentas-que-no-son-n1)).
- Para que no vuelva: un test de integración que cuente queries del endpoint y falle si supera el límite esperado.
