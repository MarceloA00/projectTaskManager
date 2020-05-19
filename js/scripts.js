listeners();
var listaProyectos = document.querySelector('ul#proyectos');

function listeners() {

    document.addEventListener('DOMContentLoaded', function () {
        actualizarProgreso();
    });

    document.querySelector('.crear-proyecto a').addEventListener('click', nuevoProyecto);

    if (document.querySelector('.nueva-tarea')) {
        document.querySelector('.nueva-tarea').addEventListener('click', agregartarea);
    }

    document.querySelector('.listado-pendientes').addEventListener('click', accionesTareas);
}

var open = true;

function nuevoProyecto(e) {

    if (open === true) {
        open = false;
        e.preventDefault();
        console.log('funciona')

        var nuevoProyecto = document.createElement('li');
        nuevoProyecto.innerHTML = '<input type="text" id="nuevo-proyecto" maxlength="100">';

        listaProyectos.appendChild(nuevoProyecto);

        var inputNuevo = document.querySelector('#nuevo-proyecto');

        inputNuevo.addEventListener('keypress', function (e) {
            var tecla = e.which || e.keyCode;

            if (tecla === 13) {
                guardarProyecto(inputNuevo.value);
                listaProyectos.removeChild(nuevoProyecto);
                open = true;
            }
        });
    }

}

function guardarProyecto(nombreProyecto) {

    var xhr = new XMLHttpRequest;
    var datos = new FormData();
    datos.append('proyecto', nombreProyecto);
    datos.append('accion', 'crear');

    xhr.open('POST', 'includes/modelos/modelo-proyecto.php', true);

    xhr.onload = function () {
        if (this.status === 200) {
            var respuesta = JSON.parse(xhr.responseText);
            var proyecto = respuesta.nombre_proyecto,
                id_proyecto = respuesta.id_insertado,
                tipo = respuesta.tipo,
                resultado = respuesta.respuesta;

            if (resultado === 'correcto') {
                if (tipo === 'crear') {
                    var nuevoProyecto = document.createElement('li');
                    nuevoProyecto.innerHTML = `
                    <a class="wrap-text" href="index.php?id_proyecto=${id_proyecto}" id="proyecto:${id_proyecto}">${proyecto}</a>
                    `;
                    listaProyectos.appendChild(nuevoProyecto);

                    Swal.fire({
                        type: 'success',
                        title: 'Exito!',
                        text: 'El Proyecto fue Creado Correctamente',
                    })
                        .then(resultado => {
                            if (resultado.value) {
                                window.location.href = 'index.php?id_proyecto=' + id_proyecto;
                            }
                        })
                } else {

                }
            } else {
                Swal.fire({
                    type: 'error',
                    title: 'Oops...',
                    text: 'Hubo un error!',
                });
            }
        }
    }

    xhr.send(datos);
}

function agregartarea(e) {
    e.preventDefault();

    var nombreTarea = document.querySelector('.nombre-tarea').value;
    console.log(document.querySelector('.nombre-tarea').value);
    if (nombreTarea === '') {
        Swal.fire({
            type: 'error',
            title: 'Oops...',
            text: 'Una tarea no puede ir vacia'
        });
    } else {
        var xhr = new XMLHttpRequest;

        var datos = new FormData();
        datos.append('tarea', nombreTarea);
        datos.append('accion', 'crear');
        datos.append('id_proyecto', document.querySelector('#id_proyecto').value);

        xhr.open('POST', 'includes/modelos/modelo-tareas.php', true);

        xhr.onload = function () {
            if (this.status === 200) {
                var respuesta = JSON.parse(xhr.responseText);
                var resultado = respuesta.respuesta,
                    tarea = respuesta.tarea,
                    id_insertado = respuesta.id_insertado,
                    tipo = respuesta.tipo;

                if (resultado === 'correcto') {
                    if (tipo === 'crear') {
                        Swal.fire({
                            type: 'success',
                            title: 'Exito!',
                            text: 'Tarea Creada Correctamente'
                        });

                        var parrafoVacio = document.querySelectorAll('.lista-vacia');

                        if (parrafoVacio.length > 0) {
                            document.querySelector('.lista-vacia').remove();
                        }

                        var nuevaTarea = document.createElement('li');

                        nuevaTarea.id = 'tarea: ' + id_insertado;

                        nuevaTarea.classList.add('tarea');

                        nuevaTarea.innerHTML = `
                        <p class="wrap-p">${tarea}</p>
                        <div class="acciones">
                            <i class="far fa-check-circle"></i>
                            <i class="fas fa-trash"></i>
                        </div>
                        `

                        var listado = document.querySelector('.listado-pendientes ul');
                        listado.appendChild(nuevaTarea);

                        document.querySelector('.agregar-tarea').reset();

                        actualizarProgreso();
                    }
                } else {
                    Swal.fire({
                        type: 'error',
                        title: 'Oops...',
                        text: 'Hubo un error'
                    });
                }
                
            }
        }

        xhr.send(datos);
    }
}

function accionesTareas(e) {
    e.preventDefault();
    if (e.target.classList.contains('fa-check-circle')) {
        if (e.target.classList.contains('completo')) {
            e.target.classList.remove('completo');
            cambiarEstado(e.target, 0);
        } else {
            e.target.classList.add('completo');
            cambiarEstado(e.target, 1);
        }
    }
    if (e.target.classList.contains('fa-trash')) {
        Swal.fire({
            title: 'Segur@?',
            text: "Esta accion no se puede deshacer!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, borrar!',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.value) {
                var tareaEliminar = e.target.parentElement.parentElement;

                eliminarBD(tareaEliminar);

                tareaEliminar.remove();

                Swal.fire(
                    'Eliminado!',
                    'La tarea fue eliminada correctamente.',
                    'success'
                )
            }
        })
    }
}

function cambiarEstado(tarea, estado) {
    var idTarea = tarea.parentElement.parentElement.id.split(':');

    var xhr = new XMLHttpRequest();

    var datos = new FormData();
    datos.append('id', idTarea[1]);
    datos.append('accion', 'actualizar');
    datos.append('estado', estado);

    xhr.open('POST', 'includes/modelos/modelo-tareas.php', true);

    xhr.onload = function () {
        if (this.status === 200) {
            console.log(JSON.parse(xhr.responseText));
            actualizarProgreso();
        }
    }

    xhr.send(datos);
}

function eliminarBD(tarea) {
    var idTarea = tarea.id.split(':');

    var xhr = new XMLHttpRequest();

    var datos = new FormData();
    datos.append('id', idTarea[1]);
    datos.append('accion', 'eliminar');

    xhr.open('POST', 'includes/modelos/modelo-tareas.php', true);

    xhr.onload = function () {
        if (this.status === 200) {
            console.log(JSON.parse(xhr.responseText));

            var tareasRestantes = document.querySelectorAll('li.tarea');
            if (tareasRestantes.length === 0) {
                document.querySelector('.listado-pendientes ul').innerHTML = "<p class='lista-vacia'>No hay tareas en este proyecto</p>";
            }
            actualizarProgreso();
        }
    }

    xhr.send(datos);
}

function actualizarProgreso() {
    const tareas = document.querySelectorAll('li.tarea');

    const tareasCompletadas = document.querySelectorAll('i.completo');

    const avance = Math.round((tareasCompletadas.length / tareas.length) * 100);

    const porcentaje = document.querySelector('#porcentaje');

    porcentaje.style.width = avance + '%';

    if(avance === 100) {
        Swal.fire({
            type: 'success',
            title: 'Exito!',
            text: 'El Proyecto fue Completado!'
        });
    }


}