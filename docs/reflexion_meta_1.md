1.	¿Qué partes del proyecto base decidiste no tocar y por qué? 
La base, el seed, Prisma, el listado y el servicio de categorías. Porque claramente en las intrucciones dice: no rescribas lo que ya funciona.

2.	¿Dónde vive cada uno de los tres estados que aparecen en la unidad? Da un ejemplo de tu proyecto. 
- Estado local (Formulario): Vive en el componente (ej. useActionState en AssetForm.tsx para el código y nombre del activo mientras escribes).
- Estado en la URL (Filtros/Paginación): Vive en los searchParams (ej. ?page=2&status=LOANED para que la búsqueda se pueda compartir y recargar).
- Estado global (Interfaz efímera): Vive en Zustand (ej. el DeleteTarget que guarda el ID del activo temporalmente para abrir el modal de eliminación).

3.	¿Por qué serialNumber es opcional en la base y obligatorio en el formulario?
En la base de datos (Prisma) es opcional (String?) para no corromper los activos viejos que ya estaban registrados y no tenían este dato. En el formulario (Zod) es obligatorio para garantizar que cualquier activo que se registre a partir de hoy sí lo incluya.

4.	¿Qué pasaría si eliminas la validación del servidor y dejas solo la del cliente?
Cualquier usuario podría esquivar las reglas simplemente desactivando JavaScript en su navegador o enviando una petición directa (con Postman o curl). Esto permitiría inyectar datos basura, duplicados o maliciosos directo en tu base de datos. La validación del cliente es para dar una buena experiencia; la del servidor es para la seguridad real.

5.	¿Por qué el servicio no debe conocer revalidatePath ni los mensajes de la interfaz?
Porque el servicio (asset.service.ts) solo debe manejar la lógica de negocio y la base de datos. Si le metes funciones específicas de React o Next.js, lo acoplas a la interfaz. Mantenerlo agnóstico te permite reutilizar ese mismo servicio mañana en una ruta de API, en un script de terminal o en un cron job sin que falle porque "no encuentra una ruta que revalidar".

6.	¿Qué diferencia hay entre validar un formulario y normalizar un filtro?
Por ejemplo al Validar un formulario Si el dato está mal (ej. nombre vacío), la acción falla, se detiene el proceso y se le devuelve un error explícito al usuario en la pantalla ("Revisa los campos"). En cambio si se normaliza un filtro y el dato está mal en la URL (ej. el usuario manipula la URL a ?page=texto_basura), no le muestras un error ni rompes la página. Simplemente lo capturas y lo transformas en un valor por defecto seguro (usando .catch(1) para devolverlo a la página 1).
