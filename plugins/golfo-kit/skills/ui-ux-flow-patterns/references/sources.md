# Fuentes

Investigación usada para los criterios de esta skill (octubre 2026). Las guías de design systems públicos (Material, Carbon, Polaris, Primer, GOV.UK, SAP Fiori, CMS) pesan más que los artículos de blogs; los números (tiempos, duraciones, cantidad de pasos) son puntos de partida, no reglas absolutas.

## Estados vacíos

- [SAP Fiori: Designing for empty states](https://www.sap.com/design-system/fiori-design-web/v1-136/foundations/best-practices/global-patterns/designing-for-empty-states): explicar propósito, causa y siguiente paso; tono no negativo.
- [Shopify Polaris: Empty state](https://polaris.shopify.com/components/empty-state): para listas, tablas o gráficos sin datos; banner para estados que no son ausencia de contenido.
- [Setproduct: Empty states UI design](https://setproduct.com/blog/empty-state-ui-design): tipos (primer uso, sin resultados, vaciado por el usuario).
- [Vendasta: Empty state best practices](https://www.vendasta.com/blog/user-experience-empty-state-best-practices/).

## Carga

- [VirtusLab: UX patterns beyond raw performance](https://virtuslab.com/blog/software-development/ux-patterns-beyond-raw-performance) y [SaaS UI: loading skeleton patterns](https://www.saasui.design/blog/saas-loading-skeleton-ux-patterns): umbrales 0,1 s / 1 s / 10 s, skeleton vs spinner vs barra, tiempo mínimo de display.
- [OpenReplay: Skeleton screens vs loading screens](https://blog.openreplay.com/skeleton-screens-vs-loading-screens--a-ux-battle/): evidencia mixta (Mejtoft 2018 a favor de skeletons, estudio de Viget en contra para layouts nuevos).

## Toasts, banners y canales

- [Carbon: Notification pattern](https://v10.carbondesignsystem.com/patterns/notification-pattern/): notificaciones inline persistentes vs toasts.
- [Material: Snackbars](https://material.io/components/snackbars): baja prioridad, una acción, de a uno; diálogo para dos o más acciones.
- [Polaris: Toast (deprecated)](https://polaris.shopify.com/components/deprecated/toast): mensajes cortos, rara vez para errores, banner para errores persistentes.
- [Guidewire Jutro: Toast](https://docs.guidewire.com/jutro/documentation/10.13/toast-component): no para información de campos ni crítica; límite de largo.
- [Chameleon: Toast notifications](https://www.chameleon.io/patterns/toast-notifications): no autodescartar lo que hay que consultar.
- NN/g, "Indicators, validations and notifications: pick the correct communication option" (2015), citado por el [Intelligence Community Design System](https://design.sis.gov.uk/components/badge/accessibility).

## Confirmar o deshacer

- [Primer: Delete pattern](https://primer.style/product/scenario-patterns/delete): deshacer para reversibles, diálogo para irreversibles.
- [Automattic design system: Destructive actions](https://system.automattic.design/foundations/destructive-actions/).
- [SaaS UI: Destructive actions confirmation](https://www.saasui.design/blog/saas-destructive-actions-confirmation-ux-patterns) y [DEV: confirmation vs undo vs soft delete](https://dev.to/137foundry/how-to-choose-between-confirmation-dialogs-undo-windows-and-soft-delete-patterns-1opj): ventana de deshacer de 5–10 s, escribir el nombre para alto impacto.

## Formularios y errores

- [CMS Design System: Validation](https://design.cms.gov/v/8.0.2/patterns/Forms/validation/) e [Inline error](https://design.cms.gov/components/inline-error): `aria-describedby`, no solo color, copy de qué falta hacer.
- [Yukon: help people recover from a form error](https://guide.yukon.ca/en/content-and-design/forms/user-experience-ux-standards-forms/how-help-people-recover-form-error): validación inline ~500 ms después de dejar de tipear (cita a NN/g).
- [Cengage: Inline errors](https://styleguide.cengage.com/inline-errors.html).
- [GOV.UK: Question pages](https://design-system.service.gov.uk/patterns/question-pages) y [One thing per page](https://designnotes.blog.gov.uk/2015/07/03/one-thing-per-page/); [GDS blog sobre GOV.UK Forms](https://gds.blog.gov.uk/2024/01/12/how-were-making-it-easier-to-access-government-forms-online/): check answers y confirmación.

## Wizards y onboarding

- [Visa: Wizard pattern](https://design.visa.com/patterns/wizard): guardar y salir, autosave.
- [Kompassify: Onboarding wizard guide](https://kompassify.com/blog/onboarding-wizard-guide) y [Userpilot: progressive disclosure](https://userpilot.com/blog/progressive-disclosure/): indicador de progreso, checklist corto, pasos salteables que quedan pendientes.

## Colecciones, búsqueda y upload

- [SaaS UI: data table patterns](https://www.saasui.design/blog/saas-data-table-ui-patterns): header y acciones masivas fijos, paginación vs scroll infinito.
- [Algolia: debouncing sources](https://www.algolia.com/doc/ui-libraries/autocomplete/guides/debouncing-sources.md) y [Voyado: autocomplete best practices](https://help.elevate.voyado.com/hc/en-gb/articles/26905204041116-Autocomplete-design-and-behavior-UX-best-practices): recientes al enfocar, "Buscar '…'", cancelar respuestas viejas.
- [SaaS UI: file upload patterns](https://www.saasui.design/blog/saas-file-upload-ux-patterns) y [Filestack: upload UI patterns](https://blog.filestack.com/file-upload-ui-patterns-improve-completion-rates/): validar antes de subir, estado y reintento por archivo.

## Accesibilidad del feedback

- [Adrian Roselli: Defining toast messages](https://adrianroselli.com/2020/01/defining-toast-messages.html).
- [WCAG 4.1.3 Status messages](https://www.disabilityworld.org/toolkit/standards/wcag/4-1-3-status-messages/): live region presente antes del mensaje, polite vs assertive.
- [DEV: replacing toasts with accessible feedback patterns](https://dev.to/miasalazar/replacing-toasts-with-accessible-user-feedback-patterns-1p8l).

## Productos de referencia

- [Linear design breakdown](https://blakecrosley.com/guides/design/linear): keyboard-first, optimistic UI, paleta de comandos.
- [Modern SaaS patterns (Exxat DS)](https://cdn.jsdelivr.net/npm/@exxatdesignux/ui@0.6.59/consumer-extras/patterns/modern-saas-patterns.md): Notion (edición inline, slash commands) y Stripe Dashboard (chips de estado, activity log).
- [Botones en pending y doble envío](https://flaviocopes.com/courses/forms/pending-success-and-error/).
