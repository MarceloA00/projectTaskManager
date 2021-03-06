<?php
function obtenerPaginaActual()
{
    $archivo = basename($_SERVER['PHP_SELF']);
    $pagina = str_replace('.php', '', $archivo);
    return $pagina;
}

function obtenerProyectos()
{
    include 'bd.php';
    try {
        return $conn->query(' SELECT id, nombre FROM proyectos ');
    } catch (Exception $e) {
        echo 'Error! : ' . $e->getMessage();
        return false;
    }
}

function obtenerNombreProyecto($id = null)
{
    include 'bd.php';
    try {
        return $conn->query(" SELECT nombre FROM proyectos WHERE id = {$id} ");
    } catch (Exception $e) {
        echo 'Error! : ' . $e->getMessage();
        return false;
    }
}

function obtenerTareas($id = null) {
    include 'bd.php';
    try {
        return $conn->query(" SELECT id, nombre, estado FROM tareas WHERE id_proyecto = {$id} ");
    } catch (Exception $e) {
        echo 'Error! : ' . $e->getMessage();
        return false;
    }
}
