const Cliente = require('../modelos/cliente');


exports.registrarCliente = function (req, res) {
    const {
        nombre,
        username,
        ape_pat,
        ape_mat,
        email,
        telefono,
        contrasena,
        razonSocial,
        rfc,
        direccion,
        colonia,
        municipio,
        estado,
        cp,
        num_ext,
        num_int,
        fecha_registro
    } = req.body;
    clienteNuevo = new Cliente({
        nombre: nombre,
        username: username,
        ape_pat: ape_pat,
        ape_mat: ape_mat,
        email: email,
        telefono: telefono,
        contrasena: contrasena,
        razonSocial: razonSocial,
        rfc: rfc,
        direccion: direccion,
        colonia: colonia,
        municipio: municipio,
        estado: estado,
        cp: cp,
        num_ext: num_ext,
        num_int: num_int,
        fecha_registro: fecha_registro
    })
    clienteNuevo.save(function (err, exito) {
        if (err) {
            console.log(err);
            return res.status(422).send({ titulo: 'No se pudo crear el registro' });
        }
        return res.json(exito);
    })
}
exports.obtenerClientes = function (req, res) {
    Cliente.find({ activo: 1 }, { _id: 1, nombre: 1, ape_mat: 1, ape_pat: 1, email: 1 })
        .exec(function (err, clientes) {
            if (err) return res.status(422).send({ titulo: 'No se pudieron obtener los clientes' });
            return res.json(clientes);
        })
}
exports.obtenerDatosClientes = function (req, res) {
    Cliente.find({ activo: 1 })
        .exec(function (err, clientes) {
            if (err) return res.status(422).send({ titulo: 'No se pudieron obtener los clientes' });
            return res.json(clientes);
        })
}
exports.obtenerClienteNombreEmail = function (req, res) {
    Cliente.findOne({ nombre: req.params.nombre, email: req.params.email })
        .exec(function (err, cliente) {
            if (err) return res.status(422).send({ titulo: 'Ocurrio un error al buscar al cliente' });
            return res.json(cliente);
        })
}
exports.eliminarCliente = function (req, res) {
    Cliente.findOneAndUpdate({ _id: req.params.id }, {
        activo: 0
    })
        .exec(function (err, clienteEliminado) {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo eliminar el cliente' });
            return res.json(clienteEliminado);
        })
}
exports.obtenerPedidosCliente = function (req, res) {
    Cliente.findById(req.params.id, { _id: 0, nombre: 0, username: 0, ape_pat: 0, ape_mat: 0, email: 0, telefono: 0, contrasena: 0, razonSocial: 0, rfc: 0, direccion: 0, colonia: 0, municipio: 0, estado: 0, cp: 0, num_ext: 0, num_int: 0, fecha_registro: 0, activo: 0 })
        .populate({
            path: 'pedidos',
            populate: {
                path: 'productos',
                populate: {
                    path: 'familia'
                }
            }
        })
        .exec(function (err, clientes) {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudieron obtener los pedidos del cliente' });
            return res.json(clientes.pedidos)
        })
}
exports.editarCliente = function (req, res) {
    Cliente.findByIdAndUpdate({ _id: req.body._id }, {
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
        .exec(function (err, cliente) {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo actualizar el perfil del cliente' });
            return res.json(cliente);
        })
}
exports.obtenerClientesEliminados = function (req, res) {
    Cliente.find({ activo: 0 })
        .exec(function (err, clientesEliminados) {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudieron obtener los clientes eliminados' });
            return res.json(clientesEliminados);
        })
}
exports.restaurarClienteEliminado = function (req, res) {
    Cliente.findByIdAndUpdate(req.params.id, { activo: 1 })
        .exec(function (err, clienteRestaurado) {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo restaurar al cliente' });
            return res.json(clienteRestaurado);
        })
}