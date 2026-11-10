# Bitácora de Uso - Inteligencia Artificial

## Entrada 1
### Objetivo
Evitar que la cuadrícula de cromos desaparezca y deje la pantalla vacía mientras la API consulta los datos de un nuevo mundo.

### Problema
En `useMundos.js` se ejecutaba `setMundos(null)` al inicio de cada petición HTTP. Esto reseteaba el estado a vacío y desmontaba inmediatamente las tarjetas del mundo anterior antes de recibir la nueva respuesta del servidor.

### Solución
Se eliminó la línea `setMundos(null)`. Al mantener los datos previos en el estado, los cromos antiguos permanecen visibles hasta que la respuesta de la API llega y reemplaza el contenido en un solo renderizado.

---

## Entrada 2

### Objetivo
Sincronizar en tiempo real los filtros de catálogo (`mundo`, `rareza`, `tipo`) con la barra de direcciones del navegador mediante query parameters.

### Respuesta errónea y problema
La IA planteó ubicar la llamada a `window.history.replaceState` dentro de la función de limpieza (`return () => {}`) del `useEffect`, asumiendo que la URL debía modificarse al limpiar el efecto. Esto provocó que la barra de direcciones no se actualizara al hacer clic, sino con un paso de retraso o al abandonar la vista. 

Adicionalmente, al recargar directamente en `/mundos`, la aplicación se rompió con el error `Cannot read properties of undefined (reading 'toLowerCase')` porque la IA asumió que los textos de la API ya estaban resueltos en el primer render.

### Solución
1. Se trasladó `replaceState` al cuerpo principal del `useEffect` para que la URL se actualice de inmediato ante cada cambio de filtro, eliminando el bloque de retorno innecesario.
2. Se aseguró la variable del selector de ordenamiento con encadenamiento opcional y valor por defecto:
```javascript
(sortOption || sortOptionsDesktop[0])?.toLowerCase() ?? ''
```
---

## Entrada 3

### Objetivo
Guardar la preferencia de idioma en una cookie solo si el usuario aprobó las cookies de preferencias, y eliminarla si revocó dicho consentimiento.

### Problema
En `handleSaveCookies` se evaluaba `if (!cookiesConsent?.preferencias)` inmediatamente después de llamar a `setCookiesConsent(selection)`. Dado que la actualización de estado en React es asíncrona, en esa línea `cookiesConsent` todavía valía `null`, lo que provocaba que la cookie se borrara por error aunque el usuario hubiera hecho clic en "Aceptar todas".

### Solución
Se descartó la lectura del estado y se utilizó directamente el argumento recibido por la función:
```javascript
if (selection.preferencias) {
  setCookie('idioma', language);
} else {
  deleteCookie('idioma');
}
```
Si el permiso es falso, se llama a `deleteCookie`, la cual invalida la cookie asignándole tiempo de expiración inmediato (`max-age=0`).

## Entrada 4

### Objetivo
Evitar que el panel de accesibilidad en versión móvil se cerrara automáticamente al hacer clic en cualquier parte de la pantalla.

### Problema
El componente `Dropdown` de la barra de navegación de escritorio permanecía en el DOM aunque estuviera oculto por CSS (`display: none`). Al mantener su estado interno abierto, su escuchador global `document.addEventListener('mousedown', handleClickOutside)` seguía activo. Cualquier toque en el menú móvil era interpretado como un clic fuera del dropdown de escritorio, disparando el cierre inmediato de la interfaz móvil.

### Solución
Se modificó `Dropdown.jsx` para comprobar si el elemento está visible en el renderizado antes de procesar el evento de clic externo:
```javascript
if (dropdownRef.current && dropdownRef.current.offsetParent === null) {
  return;
}
```
Si el componente está oculto por reglas de CSS (`offsetParent === null`), se ignora el evento y se previene el cierre accidental.

---

## Entrada 5

### Objetivo
Solucionar la compresión visual de los filtros entre 800px y 900px, donde los nombres de los mundos y las etiquetas de rareza se desbordaban y partían en varias líneas.

### Problema
El contenedor principal utilizaba una distribución porcentual rígida (`grid-template-columns: 3fr 7fr`). En pantallas de tablet, el 30% asignado a la columna lateral representaba menos de 200px útiles, espacio insuficiente para contener simultáneamente los iconos, nombres largos y contadores de cartas.

### Solución
Se ajustó el punto de corte en `Worlds.module.css` para que a partir de `1024px` hacia abajo la barra lateral se oculte por completo. En su lugar, se activó la barra superior de selectores tipo dropdown, agregando además un dropdown específico para cambiar de mundo. Esto permitió que la cuadrícula de cromos aprovechara el ancho total de la pantalla sin deformar los filtros.