
$script_path = '/project/plantilla_gerencial/leccion/1.php';
$current_dir = dirname($script_path); // /project/plantilla_gerencial/leccion
$current_dir = str_replace('\\', '/', $current_dir);
$base_url = "http://host" . rtrim($current_dir, '/') . '/'; // http://host/project/plantilla_gerencial/leccion/
$base_url = preg_replace('/\/[^\/]+\/?$/', '/', $base_url); // http://host/project/plantilla_gerencial/
echo "Base URL: " . $base_url . "\n";
