"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const cliente_model_1 = require("../modelos/cliente.model");
const servidor_1 = __importDefault(require("../clases/servidor"));
const Socket = __importStar(require("../sockets/socket"));
exports.registrarCliente = (req, res) => {
    const clienteNuevo = new cliente_model_1.Cliente(req.body);
    clienteNuevo.sucursal = res.locals.usuario.sucursal;
    clienteNuevo.save((err, cliente) => {
        if (err)
            return res.status(422).send({ titulo: 'No se pudo crear el registro' });
        obtenerNuevoCliente(cliente, res, 0);
        return res.json(cliente);
    });
};
exports.obtenerClientes = (req, res) => {
    cliente_model_1.Cliente.find({ activo: 1, sucursal: res.locals.usuario.sucursal }, { _id: 1, nombre: 1, ape_mat: 1, ape_pat: 1, email: 1 })
        .exec((err, clientes) => {
        if (err)
            return res.status(422).send({ titulo: 'No se pudieron obtener los clientes' });
        return res.json(clientes);
    });
};
exports.obtenerDatosClientes = (req, res) => {
    cliente_model_1.Cliente.find({ activo: 1, sucursal: res.locals.usuario.sucursal })
        .exec((err, clientes) => {
        if (err)
            return res.status(422).send({ titulo: 'No se pudieron obtener los clientes' });
        return res.json(clientes);
    });
};
exports.obtenerClienteNombreEmail = (req, res) => {
    cliente_model_1.Cliente.findOne({ nombre: req.params.nombre, email: req.params.email })
        .exec((err, cliente) => {
        if (err)
            return res.status(422).send({ titulo: 'Ocurrio un error al buscar al cliente' });
        return res.json(cliente);
    });
};
exports.eliminarCliente = (req, res) => {
    cliente_model_1.Cliente.findOneAndUpdate({ _id: req.body._id }, {
        activo: 0
    })
        .exec((err, clienteEliminado) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo eliminar el cliente' });
        obtenerNuevoCliente(clienteEliminado, res, 1);
        return res.json({ titulo: 'Cliente eliminado', detalles: 'Cliente eliminado exitosamente' });
    });
};
exports.obtenerPedidosCliente = (req, res) => {
    cliente_model_1.Cliente.findById(req.params.id, { _id: 0, nombre: 0, username: 0, ape_pat: 0, ape_mat: 0, email: 0, telefono: 0, contrasena: 0, razonSocial: 0, rfc: 0, direccion: 0, colonia: 0, municipio: 0, estado: 0, cp: 0, num_ext: 0, num_int: 0, fecha_registro: 0, activo: 0 })
        .populate({
        path: 'pedidos',
        populate: {
            path: 'productos',
            populate: {
                path: 'familia'
            }
        }
    })
        .exec((err, cliente) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'No se pudieron obtener los pedidos del cliente' });
        if (cliente)
            return res.json(cliente.pedidos);
    });
};
exports.editarCliente = (req, res) => {
    cliente_model_1.Cliente.findByIdAndUpdate({ _id: req.body._id }, {
        nombre: req.body.nombre,
        username: req.body.username,
        ape_pat: req.body.ape_pat,
        ape_mat: req.body.ape_mat,
        email: req.body.email,
        telefono: req.body.telefono,
        contrasena: req.body.contrasena,
        razonSocial: req.body.razonSocial,
        rfc: req.body.rfc,
        direccion: req.body.direccion,
        colonia: req.body.colonia,
        municipio: req.body.municipio,
        estado: req.body.estado,
        cp: req.body.cp,
        num_ext: req.body.num_ext,
        num_int: req.body.num_int,
        pedidos: req.body.pedidos,
        fecha_registro: req.body.fecha_registro,
        activo: req.body.activo
    })
        .exec((err, cliente) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo actualizar el perfil del cliente' });
        cliente_model_1.Cliente.findById(cliente.id).exec((err, cliente) => {
            obtenerNuevoCliente(cliente, res, 2);
            return res.json({ titulo: 'Cliente actualizado', detalles: 'Datos guardados exitosamente' });
        });
    });
};
exports.obtenerClientesEliminados = (req, res) => {
    cliente_model_1.Cliente.find({ activo: 0, sucursal: res.locals.usuario.sucursal })
        .exec((err, clientesEliminados) => {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'No se pudieron obtener los clientes eliminados' });
        return res.json(clientesEliminados);
    });
};
exports.restaurarClienteEliminado = (req, res) => {
    cliente_model_1.Cliente.findByIdAndUpdate(req.body._id, { activo: 1 })
        .exec(function (err, clienteRestaurado) {
        if (err)
            return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo restaurar al cliente' });
        obtenerNuevoCliente(clienteRestaurado, res, 0);
        obtenerNuevoCliente(clienteRestaurado, res, 3);
        return res.json({ titulo: 'Cliente restaurado', detalles: 'Cliente restaurado exitosamente' });
    });
};
/* Funciones para sockets */
function obtenerNuevoCliente(cliente, res, tipo) {
    const servidor = servidor_1.default.instance;
    for (let usuarioConectado of Socket.usuariosConectados.lista) {
        if (usuarioConectado !== undefined && usuarioConectado._id != res.locals.usuario._id && usuarioConectado.rol == 2 && usuarioConectado.rol_sec == 0 && usuarioConectado.sucursal == res.locals.usuario.sucursal) {
            switch (tipo) {
                case 0:
                    servidor.io.in(usuarioConectado.id).emit('nuevo-cliente', cliente);
                    break;
                case 1:
                    servidor.io.in(usuarioConectado.id).emit('nuevo-cliente-eliminado', cliente);
                    break;
                case 2:
                    servidor.io.in(usuarioConectado.id).emit('nuevo-cliente-editado', cliente);
                    break;
                case 3:
                    servidor.io.in(usuarioConectado.id).emit('nuevo-cliente-restaurado', cliente);
                    break;
            }
        }
    }
}
