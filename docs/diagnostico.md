¿Dónde debe vivir cada dato y cada regla para que el formulario, la edición, la eliminación y los filtros no se contradigan entre sí? 

Dónde deben vivir los datos (Estado)
    - Filtros y paginación: En la URL (searchParams). Esto garantiza que las búsquedas sean compartibles, recargables y que el servidor sepa exactamente qué datos pedirle a la base antes de renderizar la vista.
    - Valores del formulario: En el estado local del componente. Solo existen y mutan de forma inmediata mientras el usuario escribe en esa pantalla específica.
    - Resultados de operaciones: Administrados mediante useActionState. Representan la respuesta directa del servidor (errores por campo, confirmaciones de éxito) tras intentar una mutación.
    - Interfaz global: En Zustand. Se reserva estrictamente para elementos efímeros que cruzan el árbol de componentes, como el disparador de notificaciones (toasts) o el ID del activo seleccionado para abrir un modal de eliminación.
Dónde deben vivir las reglas (Lógica)
    - Validaciones de datos: En esquemas centralizados de Zod (assetSchema.ts). Se escriben una sola vez y se ejecutan tanto en el cliente (para retroalimentación visual rápida) como en el servidor (para seguridad inquebrantable).
    - Reglas de negocio: En la capa de servicios (asset.service.ts). Decisiones como "no se puede borrar un activo prestado" o "el número de serie debe ser único" operan cerca de Prisma, garantizando que la regla se aplique siempre, sin importar qué botón o formulario disparó la acción.

