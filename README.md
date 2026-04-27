# Plantilla de Cursos Gerenciales (Híbrida Next.js + PHP)

Esta plantilla es un sistema híbrido que utiliza **Next.js 15** para la interfaz de usuario moderna e interactiva, y se despliega en un entorno **PHP MVC (CodeIgniter)** para gestionar la lógica de backend, sesiones y progreso del usuario.

## 📁 Estructura del Proyecto

*   `app/`, `components/`, `contexts/`: Código fuente de React/Next.js.
*   `public/`: Archivos estáticos originales (imágenes, videos).
*   `out/`: Carpeta generada automáticamente por Next.js tras el build (HTML estático). **No editar manualmente.**
*   `plantilla_gerencial/`: **CARPETA DE PRODUCCIÓN**. Contiene los archivos `.php` finales procesados y listos para el servidor.
*   `full_fix_php.js`: Script de automatización que convierte el build de Next.js en archivos PHP compatibles con el servidor.

---

## 🛠 Procedimiento de Desarrollo y Actualización

Si necesitas realizar cambios en el diseño, agregar contenido o corregir funciones de React, sigue este flujo:

### 1. Desarrollo Local
Ejecuta el servidor de desarrollo para ver los cambios en tiempo real:
```bash
npm run dev
```

### 2. Generación de Build
Una vez que los cambios estén listos, genera la exportación estática:
```bash
npm run build
```
*Esto actualizará la carpeta `out/` con el nuevo código de React.*

### 3. Procesamiento para PHP
Ejecuta el script de automatización para inyectar la lógica de backend y corregir rutas:
```bash
node full_fix_php.js
```
*Este comando actualizará automáticamente todos los archivos dentro de `plantilla_gerencial/`.*

---

## 🚀 Despliegue en Producción

Para subir el curso al servidor, **solo necesitas la carpeta `plantilla_gerencial`**.

### Pasos para el despliegue:
1.  Conéctate a tu servidor vía FTP/SFTP.
2.  Navega a la ruta de destino: `/courses/course_content/cursos/`.
3.  Sube (o reemplaza) la carpeta `plantilla_gerencial` completa.
4.  Asegúrate de que el archivo `functions_helpers.php` exista tres niveles arriba (`../../../`) de la carpeta del curso, ya que es una dependencia crítica para la sesión.

---

## 🧠 Detalles Técnicos de Integración

### Inyección de Datos (window.COURSE_DATA)
El script `full_fix_php.js` inyecta automáticamente variables de PHP en el objeto global de JavaScript. Esto permite que React conozca:
*   `code`: Código del curso.
*   `user`: Nombre del empleado.
*   `userId`: ID del usuario.
*   `language`: Idioma preferido (detectado por la URL `?lang=es/en`).

### Navegación y Parámetros
Todos los enlaces internos se convierten automáticamente de `/ruta` a `ruta.php?course_code=...&uid=...&mid=...`. Esto garantiza que el usuario nunca pierda su sesión ni el seguimiento de progreso al navegar entre módulos.

### Hidratación de React
Para que componentes como el **Drawer**, el **Botón de Idioma** y el **Reproductor de Audio** funcionen, es vital que los scripts en `_next/static/chunks/` carguen correctamente. El script de procesamiento usa una variable `$base_url` dinámica en PHP para asegurar que las rutas funcionen sin importar la profundidad de la carpeta (ej. `index.php` vs `leccion/1.php`).

---

## 🔌 Integración con Backend y Tracking

El sistema utiliza un puente entre PHP (servidor) y React (cliente) para manejar la información del usuario y el progreso.

### 1. Extracción de Datos en el Servidor (PHP)
En cada archivo `.php`, se ejecuta el siguiente bloque inicial para conectar con CodeIgniter y validar la sesión:

```php
<?php 
require_once('./../../../functions_helpers.php'); // Conexión con el núcleo del sistema
check_session(); // Valida que el usuario esté logueado
$CI =& get_instance(); // Instancia de CodeIgniter para acceder a modelos

$course_code = $_GET['course_code']; // Captura el código del curso de la URL
$CI->load->model('training/evaluation_model'); // Carga el modelo de seguimiento

// Extrae información del usuario desde la sesión de CodeIgniter
$fullname = $CI->session->userdata('employee_data')['fullname']; 
$user_id = $CI->session->userdata('employee_data')['user_id']; 

// Tracking de Progreso
$unique_course_id = check_permission_employee_course($course_code); 
$modules_user = $CI->evaluation_model->get_read_progress_user($unique_course_id, [], [$user_id])[0]; 
$module = get_course_modules($course_code)[0]; 
$module_id = $module['id']; 
?>
```

### 2. Persistencia y Paso de Datos a React
Para que React pueda usar estos datos sin recargar la página, el script inyecta la información en el objeto `window` y en el `localStorage` del navegador:

```html
<script>
    window.COURSE_DATA = {
        code: "<?= $course_code ?>",     // Código para reportar progreso
        user: "<?= $fullname ?>",       // Nombre para mostrar en perfil
        userId: "<?= $user_id ?>",      // ID único del estudiante
        courseId: "<?= $unique_course_id ?>",
        moduleId: "<?= $module_id ?>",
        language: "<?= $_GET['lang'] ?>" // Persistencia de idioma
    };

    // Persistencia en LocalStorage para acceso rápido en componentes React
    localStorage.setItem("COURSE_CODE", "<?= $course_code ?>");
    localStorage.setItem("USER_ID", "<?= $user_id ?>");
    localStorage.setItem("FULLNAME", "<?= $fullname ?>");
</script>
```

### 3. Sistema de Tracking
*   **Identificación**: Se usa el `userId` y `courseId` para identificar qué usuario está realizando qué curso.
*   **Progreso**: La variable `$modules_user` contiene el estado actual de lectura del usuario, lo que permite a la plantilla marcar módulos como completados.
*   **Navegación Persistente**: Todos los enlaces internos mantienen los parámetros `?course_code=...&uid=...&mid=...` para que el backend nunca pierda el rastro del usuario durante la navegación.

---

## ⚠️ Notas Importantes
*   **Nunca** edites los archivos dentro de `plantilla_gerencial/` directamente, ya que se sobrescribirán la próxima vez que ejecutes el script.
*   Si agregas una nueva página en Next.js, asegúrate de que el script `full_fix_php.js` la procese correctamente verificando la consola al ejecutarlo.
