1.	¿Por qué los valores del formulario no viven en useActionState?
Los valores no viven en useActionState porque este hook está diseñado para manejar el resultado o estado de la acción del servidor (éxito, errores de validación, mensajes), no el estado en vivo de los inputs. El navegador gestiona los valores nativamente mediante FormData al hacer submit.

2.	¿Qué diferencia hay entre un error de validación y un error de negocio?
Un error de validación verifica que los datos tengan el formato correcto (ej. un campo vacío o un texto muy corto, evaluado por Zod). Un error de negocio ocurre por reglas de la aplicación en el servidor (ej. "este número de serie ya está registrado" o "no puedes eliminar un activo asignado").

3.	¿Por qué el diálogo no se cierra cuando la eliminación falla?
El diálogo no se cierra si falla la eliminación para no hacerle perder el contexto al usuario. Mantenerlo abierto permite mostrar el mensaje de error o el toast explicativo en el mismo lugar donde ocurrió el problema, dándole la oportunidad de reintentar o cancelar.

4.	¿Qué pasaría si AssetForm usara createAssetAction también en edición?
Si usaras createAssetAction en edición, el servidor ejecutaría un comando INSERT en lugar de un UPDATE. Esto crearía un registro duplicado en la base de datos o lanzaría un error crítico si hay campos únicos (como el ID o número de serie) que ya existen.

5.	¿Por qué params debe esperarse con await en Next.js 16?
params debe esperarse con await porque, en las versiones recientes del App Router de Next.js, los parámetros de las rutas dinámicas se entregan como promesas. React necesita desenvolver esa promesa antes de poder leer el ID para renderizar la página o hacer consultas.

6.	¿Qué aporta fieldset disabled que no aporta deshabilitar solo el botón?
El fieldset disabled desactiva todos los inputs, selects y botones del formulario de un solo golpe. Si solo deshabilitas el botón principal, el usuario aún podría escribir o cambiar opciones mientras la petición está en curso (cargando), lo cual podría generar confusión o inconsistencias.
