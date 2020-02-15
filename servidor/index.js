const mongoose = require('mongoose');
const express = require('express');
const config = require('./configuracion');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const sockets = require('./sockets/socket');

/*End points */
const rutasUsuario = require('./rutas/usuario');
const rutasEstados = require('./rutas/estados');
const rutasProducto = require('./rutas/productos');
const rutasEmpleado = require('./rutas/empleado');
const rutasCliente = require('./rutas/cliente');
const rutasAdmin = require('./rutas/administrador');
/*conexion a la base de datos */
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(config.DB_URL, { useNewUrlParser: true });

/*inicializando el servidor */
const app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
module.exports.getIo = function () {
    return io;
}

/*bodyParser */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

/*cors */
app.use(cors({ origin: true, credentials: true }));

/*imagenes*/
app.use(express.static('subidas'));

/*end points */
app.use('/api/v1/usuarios', rutasUsuario);
app.use('/api/v1/empleados', rutasEmpleado);
app.use('/api/v1/estados', rutasEstados);
app.use('/api/v1/productos', rutasProducto);
app.use('/api/v1/clientes', rutasCliente);
app.use('/api/v1/admins', rutasAdmin);

/*if (process.env.NODE_ENV == 'production') {
const appPath = path.join(__dirname, '..', 'dist/cliente');
app.use(express.static(appPath));

app.get('*', function (req, res) {
    res.sendFile(path.resolve(appPath, 'index.html'));
});
}*/
/* sockets */

module.exports = http;

function escuchandoSockets() {
    console.log('Escuchando sockets');
    io.on('connection', cliente => {
        console.log('cliente conectado', cliente.id);
        //conectar cliente
        sockets.conectarCliente(cliente);
        //desconectar cliente
        sockets.desconectar(cliente);
        sockets.cerrarSesion(cliente);
        //configurar cliente
        sockets.configurarUsuario(cliente, io);
        //escuchar notificaciones
        sockets.obtenerNotificaciones(cliente, io);
        //escuchar cambios en pedidos
    })
}

const PORT = process.env.PORT || 3002;
http.listen(PORT, function () {
    escuchandoSockets(io)
    console.log("servidor funcionando...");
});