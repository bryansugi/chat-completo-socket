const { io } = require('../server');
const { Usuarios } = require('../clases/usuarios');
const { crearMensaje } = require('../utilidades/utilidades')

const usuarios = new Usuarios()

io.on('connection', (client) => {

    client.on('entrarChat', (usuario, callback) => {

        const { nombre, sala } = usuario

        if (!nombre || !sala) {
            return callback({
                error: true,
                msg: 'El nombre es necesario'
            })
        }


        //creamos la sala
        client.join(sala)

        const personas = usuarios.agregarPersona(client.id, nombre, sala)

        client.broadcast.to(sala).emit('listaPersonas', usuarios.getPersonasPorSala(sala))

        callback(usuarios.getPersonasPorSala(sala))


    })

    client.on('disconnect', () => {
        const personaBorrada = usuarios.borrarPersona(client.id)

        client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Administrador', `${personaBorrada.nombre} salió`))
        client.broadcast.to(personaBorrada.sala).emit('listaPersonas', usuarios.getPersonasPorSala(personaBorrada.sala))
    })


    //envio y recepcion de mensajes
    client.on('mensaje', (req, callback) => {

        const { mensaje } = req
        let persona = usuarios.getPersona(client.id)

        let mensajeResp = crearMensaje(persona.nombre, mensaje)
        client.broadcast.to(persona.sala).emit('mensaje', mensajeResp)

        callback(mensajeResp)
    })


    //ecuchar mensajes privados
    client.on('mensajePrivado', (req, callback) => {

        const { mensaje } = req

        let persona = usuarios.getPersona(client.id)

        let mensajeResp = crearMensaje(persona.nombre, mensaje)

        client.broadcast.to(req.para).emit('mensajePrivado', mensajeResp)

        callback(mensajeResp)


    })

});