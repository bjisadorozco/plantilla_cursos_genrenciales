<?php
$protocol = "http";
$host = "localhost";
$script_name = "/plantilla_cursos_genrenciales/plantilla_gerencial/leccion/1.php";
$current_dir = dirname($script_name);
$current_dir = str_replace('\\', '/', $current_dir);
$base_url = $protocol . "://" . $host . rtrim($current_dir, '/') . '/';
echo "Original base_url: " . $base_url . "\n";
$base_url_fixed = preg_replace('/\/[^\/]+\/?$/', '/', $base_url);
echo "Fixed base_url: " . $base_url_fixed . "\n";

$script_name_root = "/plantilla_cursos_genrenciales/plantilla_gerencial/index.php";
$current_dir_root = dirname($script_name_root);
$current_dir_root = str_replace('\\', '/', $current_dir_root);
$base_url_root = $protocol . "://" . $host . rtrim($current_dir_root, '/') . '/';
echo "Root base_url: " . $base_url_root . "\n";
?>
