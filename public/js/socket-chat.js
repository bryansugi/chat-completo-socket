const socket = io();

//const params = new URLSearchParams(window.location.search)

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
        renderizarUsuarios(resp)
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
    renderizarUsuarios(resp)
})

//escuchar mensajes
socket.on('mensaje', (resp) => {
    renderizarMensajes(resp, false)
    scrollBottom()
})


//ecuchar mensajes privados
socket.on('mensajePrivado', (resp) => {
    console.log('mensaje privado: ', resp)
})