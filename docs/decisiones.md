¿Qué dato vive en el formulario, cuál en la URL, cuál en Zustand y cuál viene del servidor? Los campos de texto viven en el estado local del componente, los filtros en la URL, las notificaciones o modales en el Zustand y los errores de operación vienen del servidor mediante useActionState.

¿Por qué la URL es la fuente de verdad y no un useState del listado? Porque los filtros de búsqueda y paginación viven exclusivamente en los searchParams de la URL, no en un useState.

¿Por qué el mismo esquema Zod se ejecuta en cliente y en servidor? El cliente lo ejecuta para darle respuestas inmediatas al usuario sin hacerlo esperar, y el servidor lo ejecuta para garantizar la seguridad e integridad de los datos en caso de que alguien desactive JavaScript.

¿Por qué se usan Server Actions y no un fetch manual desde el cliente? Porque simplifica el flujo de datos al mantener los tipos estrictos entre el cliente y el servidor, ahorrando la necesidad de construir, documentar y mantener rutas de API REST (endpoints) manuales.

¿Qué entra realmente en Zustand y qué se quedaría fuera? En Zustand (ui.store) solo viven estados temporales que necesitan compartir componentes alejados entre sí, como los mensajes tipo "toast" o el ID del activo a eliminar.

¿Por qué es opcional en la base y obligatorio en el formulario? Es opcional en la base para no romper los assets viejos que ya teniamos antes de la migración y que no tienen serie, pero es obligatorio el formulario para garantizar que cualquier activo nuevo ingresado a partir de ya, sí lo incluya obligatoriamente.
