const btnEnviar = document.getElementById('btnEnviar')


const socket = io();

const params = new URLSearchParams(window.location.search)

if (!params.has('nombre') || !params.has('sala')) {
    window.location = 'index.html'
    throw new Error('El nombre es necesario')
}

const usuario = {
    nombre: params.get('nombre'),
    sala: params.get('sala')
}

socket.on('connect', () => {
    console.log('Conectado al servidor');

    socket.emit('entrarChat', usuario, (resp) => {
        console.log('usuarios conectados', resp)
    })
});

// escuchar
socket.on('disconnect', () => {
    console.log('Perdimos conexión con el servidor');
});

//escuchar informacion
socket.on('crearMensaje', (resp) => {
    console.log(resp)
})

//escuchar cambios de usuarios , cuando un usuario entra o sale del chat
socket.on('listaPersonas', (resp) => {
    console.log(resp)
})

//envio y recepcion de mensajes

btnEnviar.addEventListener('click', function() {

    const contenido = document.querySelector('#contenido').value
    const id = document.querySelector('#id').value
        // Enviar información
    if (id) {
        socket.emit('mensajePrivado', {
            mensaje: contenido,
            para: id
        }, (resp) => {
            console.log('respuesta server: ', resp);
        });
    } else {
        socket.emit('mensaje', {
            mensaje: contenido
        }, (resp) => {
            console.log('respuesta server: ', resp);
        });
    }
})


//escuchar mensajes
socket.on('mensaje', (resp) => {
    console.log(resp)
})


//ecuchar mensajes privados
socket.on('mensajePrivado', (resp) => {
    console.log('mensaje privado: ', resp)
})