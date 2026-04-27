const fs = require('fs');
const path = require('path');

/**
 * Script de conversión SEGURO de HTML a PHP para Next.js
 * 
 * Objetivo: Restaurar el estado funcional sin romper la hidratación.
 * 
 * Transformaciones seguras:
 * 1. Inyección de cabecera PHP para sesión y variables.
 * 2. Reemplazo de rutas de assets (imágenes, vídeos, _next) usando $base_url.
 * 3. Inyección de window.COURSE_DATA.
 * 
 * EVITA:
 * - Modificar bloques de script de Next.js (self.__next_f.push).
 * - Modificar rutas internas de navegación (href="/ruta") que Next.js gestiona.
 */

function fixFile(phpPath, htmlPath, baseUrl, depth) {
    console.log(`Procesando ${path.relative(__dirname, htmlPath)} -> ${path.relative(__dirname, phpPath)}`);
    
    // Asegurar que el directorio existe
    const dir = path.dirname(phpPath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    let htmlContent = fs.readFileSync(htmlPath, 'utf8');
    
    // Template de cabecera PHP
    const phpHeader = `<?php 
require_once('${baseUrl}../../../functions_helpers.php'); 
check_session(); 
$CI =& get_instance();
$course_code = $_GET['course_code']; 
$CI->load->model('training/evaluation_model'); 
$fullname = $CI->session->userdata('employee_data')['fullname']; 
$user_id = $CI->session->userdata('employee_data')['user_id']; 
$unique_course_id = check_permission_employee_course($course_code); 
$modules_user = $CI->evaluation_model->get_read_progress_user($unique_course_id, [], [$user_id])[0]; 
$module = get_course_modules($course_code)[0]; 
$module_id = $module['id']; 

// Calcular base_url absoluta para assets
$protocol = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http");
$host = $_SERVER['HTTP_HOST'];
$script_name = $_SERVER['SCRIPT_NAME'];
$current_dir = dirname($script_name);
$current_dir = str_replace('\\\\', '/', $current_dir);
$base_url = $protocol . "://" . $host . rtrim($current_dir, '/') . '/';

// Si estamos en una subcarpeta, subimos al root del proyecto
${depth > 0 ? `$base_url = preg_replace('/\\/[^\\/]+\\/?$/', '/', $base_url);` : ''}
?>`;

    // TRANSFORMACIÓN SEGURA DE RUTAS
    // Solo reemplazamos rutas que son claramente de assets en atributos HTML.
    // EVITAMOS reemplazar dentro de scripts para no romper la hidratación de Next.js.
    let processedHtml = htmlContent;

    // 1. Reemplazar rutas de assets SOLO en atributos HTML conocidos (src, href, srcset, poster)
    // Capturamos el resto de la ruta hasta las comillas de cierre
    const assetPatterns = [
        { regex: /(href|src|srcset|poster)="(\.\/|\/)(_next\/|images\/|videos\/|fonts\/|icon-|apple-icon|favicon|placeholder|manifest\.json)([^"]*)"/g, replacement: '$1="<?php echo $base_url; ?>$3$4"' }
    ];

    assetPatterns.forEach(p => {
        processedHtml = processedHtml.replace(p.regex, p.replacement);
    });

    // 2. Inyectar estilos críticos y variables CSS en el head para asegurar que siempre estén disponibles
    const criticalStyles = `
<style>
    :root {
        --primary: #6e3cd2;
        --primary-light: #8b5cf6;
        --primary-dark: #5b32b0;
        --secondary: #c0185d;
        --background: #f8f7ff;
        --foreground: #1a1a2e;
        --gray-dark: #0C0C0C;
        --gray-medium: #6b7280;
        --gray-light: #9ca3af;
        --gray-lighter: #e5e7eb;
        --color-primary: var(--primary);
    }
    .text-primary { color: var(--primary) !important; }
    .bg-primary { background-color: var(--primary) !important; }
    .text-secondary { color: var(--secondary) !important; }
    .bg-secondary { background-color: var(--secondary) !important; }
    .font-bold { font-weight: 700 !important; }
    .readable { line-height: 1.6; }
    .opacity-0 { opacity: 0 !important; }
    .opacity-100 { opacity: 1 !important; }
    .pointer-events-none { pointer-events: none !important; }
    .pointer-events-auto { pointer-events: auto !important; }
    .hidden { display: none !important; }
</style>
`;

    // 3. Inyectar window.COURSE_DATA después del <body> para asegurar disponibilidad sin romper hidratación
    const courseDataScript = `
<script>
(function() {
    window.COURSE_DATA = {
        code: "<?= $course_code ?>",
        user: "<?= $fullname ?>",
        userId: "<?= $user_id ?>",
        courseId: "<?= $unique_course_id ?>",
        moduleId: "<?= $module_id ?>",
        progress: "<?= isset($modules_user['progress']) ? $modules_user['progress'] : 0 ?>",
        language: "<?= isset($_GET['lang']) ? $_GET['lang'] : 'es' ?>"
    };

    try {
        localStorage.setItem("COURSE_CODE", "<?= $course_code ?>");
        localStorage.setItem("USER_ID", "<?= $user_id ?>");
        localStorage.setItem("COURSE_ID", "<?= $unique_course_id ?>");
        localStorage.setItem("MODULE_ID", "<?= $module_id ?>");
        localStorage.setItem("FULLNAME", "<?= $fullname ?>");

        if (window.COURSE_DATA.language) {
            localStorage.setItem("app-language", window.COURSE_DATA.language);
        }
    } catch (e) {
        console.warn("LocalStorage no disponible");
    }
})();
</script>
`;

    let finalContent = `${phpHeader}\n${processedHtml}`;
    
    // Inyectar estilos en el head
    if (finalContent.includes('</head>')) {
        finalContent = finalContent.replace('</head>', criticalStyles + '</head>');
    } else {
        finalContent = finalContent.replace(/(<html[^>]*>)/i, '$1' + criticalStyles);
    }

    // Inyectar datos en el body
    finalContent = finalContent.replace(/(<body[^>]*>)/i, '$1' + courseDataScript);
    
    fs.writeFileSync(phpPath, finalContent);
    console.log(`- Procesado: ${phpPath}`);
}

function copyDir(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }
    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (let entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            // Solo copiamos si no es un HTML (esos se procesan y guardan por separado como .php)
            if (!entry.name.endsWith('.html')) {
                fs.copyFileSync(srcPath, destPath);
            }
        }
    }
}

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

const outDir = path.join(__dirname, 'out');
const targetDir = path.join(__dirname, 'plantilla_gerencial');

if (!fs.existsSync(outDir)) {
    console.error('Error: No se encuentra la carpeta "out/". Ejecuta "npm run build" primero.');
    process.exit(1);
}

// 1. Limpiar y sincronizar assets
console.log('Sincronizando assets de out/ a plantilla_gerencial/...');
if (fs.existsSync(targetDir)) {
    // Podríamos borrarlo todo, pero mejor borrar solo lo que vamos a regenerar
    // Para esta restauración, vamos a borrarlo para evitar residuos.
    fs.rmSync(targetDir, { recursive: true, force: true });
}
fs.mkdirSync(targetDir, { recursive: true });
copyDir(outDir, targetDir);

// 2. Procesar archivos HTML -> PHP
walkDir(outDir, (filePath) => {
    if (filePath.endsWith('.html')) {
        const relativePath = path.relative(outDir, filePath);
        const phpPath = path.join(targetDir, relativePath.replace('.html', '.php'));
        
        // Calcular baseUrl basada en la profundidad
        const depth = relativePath.split(path.sep).length - 1;
        const baseUrl = '../'.repeat(depth) || './';
        
        fixFile(phpPath, filePath, baseUrl, depth);
    }
});

console.log('\n¡Éxito! Aplicativo restaurado en plantilla_gerencial/');
console.log('Se han aplicado solo las transformaciones mínimas seguras.');
