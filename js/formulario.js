eventListeners();


function eventListeners() {
    document.querySelector('#formulario').addEventListener('submit', vaildarRegis);
}

function vaildarRegis(e) {
    e.preventDefault();

    var usuario = document.querySelector('#usuario').value,
        password = document.querySelector('#password').value,
        tipo = document.querySelector('#tipo').value;


    if (usuario === '' || password === '') {
        Swal.fire({
            type: 'error',
            title: 'Oops...',
            text: 'Ambos campos son obligatorios!',
        })
    } else {
        var datos = new FormData;

        datos.append('usuario', usuario);
        datos.append('password', password);
        datos.append('accion', tipo);

        const xhr = new XMLHttpRequest;

        xhr.open('POST', 'includes/modelos/modelo-admin.php', true);

        xhr.onload = function () {
            if (this.status === 200) {
                var respuesta = JSON.parse(xhr.responseText);
                console.log(respuesta);

                if (respuesta.respuesta === 'correcto') {
                    if (respuesta.tipo === 'crear') {
                        Swal.fire(
                            'Exito!',
                            'Usuario Creado Correctamente!',
                            'success'
                        ) 
                    } else if (respuesta.tipo === 'login'){
                        Swal.fire(
                            'Exito!',
                            'Login Correcto!',
                            'success'
                        ) 
                        .then(result => {
                            if(result.value) {
                                window.location.href = 'index.php';
                            }
                        })
                    }

                } else {
                    Swal.fire({
                        type: 'error',
                        title: 'Oops...',
                        text: 'Hubo un Error.',
                    })
                }
            }
        }

        xhr.send(datos);


    }
}