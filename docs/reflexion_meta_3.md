1.	¿Por qué los filtros no viven en Zustand, aunque funcionarían?
Porque la URL es la fuente de la verdad. Si guardas los filtros en la URL, los usuarios pueden compartir el enlace, guardarlo en favoritos y el servidor puede entregar los resultados ya filtrados desde la primera carga (SSR).

2.	¿Qué diferencia hay entre el valor del input y el valor que se escribe en la URL?
El tiempo de actualización. El valor del input cambia en tiempo real al teclear, mientras que el valor de la URL se actualiza después de una pausa (debounce) o al hacer submit, para evitar lanzar una petición al servidor por cada letra.

3.	¿Por qué useRef y no useState para la última consulta aplicada?
Para evitar re-renders y bucles. useRef almacena el valor sin provocar que la pantalla se vuelva a dibujar. Es perfecto para comparar silenciosamente qué filtro se aplicó antes y evitar bucles infinitos en un useEffect.

4.	¿Por qué se usa replace para filtros y <Link> para paginación?
Por la gestión del historial del navegador. Usamos replace en los filtros para no llenar el historial de navegación con cada letra o cambio de checkbox. Usamos <Link> en la paginación porque el usuario sí espera usar el botón de "Atrás" para regresar a la página anterior.

5.	¿Qué pasa si se renderiza un DeleteAssetDialog por fila?
Se sobrecarga el DOM. Si tienes 50 filas, tendrías 50 ventanas modales ocultas en el código, consumiendo memoria e impactando el rendimiento. Lo correcto es tener un solo diálogo a nivel de la tabla que cambie dinámicamente según el ID seleccionado.

6.	¿Cuándo corresponde loading.tsx y cuándo isPending?
Depende de la escala de la carga. loading.tsx sirve para la carga inicial al navegar a una nueva ruta completa. isPending se utiliza para mutaciones o transiciones locales, como mostrar un spinner en un botón mientras se guarda un formulario sin cambiar de página.

7.	¿Por qué un estado vacío necesita una acción y no solo un mensaje?
Para no dejar al usuario en un callejón sin salida. Un buen diseño (UX) siempre guía al usuario. Si no hay resultados, un botón de "Limpiar filtros" o "Crear nuevo registro" le da una salida inmediata y clara para seguir usando la aplicación.
