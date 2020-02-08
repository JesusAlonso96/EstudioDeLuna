const mongoose = require('mongoose'),
    express = require('express'),
    config = require('./configuracion'),
    app = module.exports = express(),
    bodyParser = require('body-parser'),
    rutasUsuario = require('./rutas/usuario'),
    rutasEstados = require('./rutas/estados'),
    rutasProducto = require('./rutas/productos'),
    rutasEmpleado = require('./rutas/empleado'),
    rutasCliente = require('./rutas/cliente'),
    rutasAdmin = require('./rutas/administrador'),
    Pestana = require('./modelos/pestana'),
    path = require('path');

//Conexion a la base de datos
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(config.DB_URL, { useNewUrlParser: true });

/*caja = new Caja({
    cantidadTotal: 0,
    cantidadEfectivo:0,
    cantidadTarjetas:0
})
caja.save();*/
//Cliente.updateMany({},{activo:1}).exec(function(err,updated){})

//Inicializando el servidor
app.use(express.static('subidas'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use('/api/v1/usuarios', rutasUsuario);
app.use('/api/v1/empleados', rutasEmpleado);
app.use('/api/v1/estados', rutasEstados);
app.use('/api/v1/productos', rutasProducto);
app.use('/api/v1/clientes', rutasCliente);
app.use('/api/v1/admins', rutasAdmin);

//if (process.env.NODE_ENV == 'production') {
    const appPath = path.join(__dirname, '..', 'dist/cliente');
    app.use(express.static(appPath));

    app.get('*', function (req, res) {
        res.sendFile(path.resolve(appPath, 'index.html'));
    });
//}

const PORT = process.env.PORT || 3002;
app.listen(PORT, function () {
    console.log("servidor funcionando...");
});