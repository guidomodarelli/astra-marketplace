# Renders innecesarios

Un re-render solo es un problema si es caro o dispara hijos caros. Medir primero qué se re-renderiza y cuánto cuesta; recién después aplicar patrones.

## Detectar

- React DevTools Profiler: grabar la interacción lenta y buscar commits largos y componentes que se renderizan sin que cambien sus props visibles ("Why did this render?").
- Chrome DevTools MCP: performance trace de la interacción; long tasks atribuidas a scripting de React indican render caro.
- Causas frecuentes: estado en un nivel demasiado alto, contexts que cambian de valor en cada render, props inline (objetos, arrays, callbacks) que rompen `React.memo`, `setState` con valores iguales, listas largas sin virtualización.

## Corregir

Aplicar los patrones de la skill `react-render-performance-patterns` (prioridad de updates, memoización, identidades estables, equality guards). Además, considerar:

- Bajar el estado al componente que lo usa o partir un context grande en varios.
- Virtualizar listas o tablas largas (`@tanstack/react-virtual`, `react-window`).

## Métricas antes/después

- Cantidad de commits y duración del commit en el Profiler para la misma interacción.
- INP o duración de la long task de la interacción.
- Cantidad de renders del componente objetivo.
