import { Request, Response } from 'express';
import { Cliente, ICliente } from '../modelos/cliente.model';
import { NativeError } from 'mongoose';
import Servidor from '../clases/servidor';
import * as Socket from '../sockets/socket';


export let registrarCliente = (req: Request, res: Response) => {
    const clienteNuevo = new Cliente(req.body);
    clienteNuevo.save((err: NativeError, cliente: ICliente) => {
        if (err) return res.status(422).send({ titulo: 'No se pudo crear el registro' });
        obtenerNuevoCliente(cliente, res, 0);
        return res.json(cliente);
    });
}
export let obtenerClientes = (req: Request, res: Response) => {
    Cliente.find({ activo: 1 }, { _id: 1, nombre: 1, ape_mat: 1, ape_pat: 1, email: 1 })
        .exec((err: NativeError, clientes: ICliente[]) => {
            if (err) return res.status(422).send({ titulo: 'No se pudieron obtener los clientes' });
            return res.json(clientes);
        });
}
export let obtenerDatosClientes = (req: Request, res: Response) => {
    Cliente.find({ activo: 1 })
        .exec((err: NativeError, clientes: ICliente[]) => {
            if (err) return res.status(422).send({ titulo: 'No se pudieron obtener los clientes' });
            return res.json(clientes);
        });
}
export let obtenerClienteNombreEmail = (req: Request, res: Response) => {
    Cliente.findOne({ nombre: req.params.nombre, email: req.params.email })
        .exec((err: NativeError, cliente: ICliente) => {
            if (err) return res.status(422).send({ titulo: 'Ocurrio un error al buscar al cliente' });
            return res.json(cliente);
        })
}
export let eliminarCliente = (req: Request, res: Response) => {
    Cliente.findOneAndUpdate({ _id: req.body._id }, {
        activo: 0
    })
        .exec((err: NativeError, clienteEliminado: ICliente) => {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo eliminar el cliente' });
            obtenerNuevoCliente(clienteEliminado, res, 1);
            return res.json({ titulo: 'Cliente eliminado', detalles: 'Cliente eliminado exitosamente' });
        });
}
export let obtenerPedidosCliente = (req: Request, res: Response) => {
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
        .exec((err: NativeError, cliente: ICliente) => {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudieron obtener los pedidos del cliente' });
            if (cliente) return res.json(cliente.pedidos);
        });
}
export let editarCliente = (req: Request, res: Response) => {
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
        .exec((err: NativeError, cliente: ICliente) => {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo actualizar el perfil del cliente' });
            Cliente.findById(cliente.id).exec((err: NativeError, cliente: ICliente)=> {
                obtenerNuevoClienteEditado(cliente,res);
                return res.json({ titulo: 'Cliente actualizado', detalles: 'Datos guardados exitosamente' });
            })
        })
}
export let obtenerClientesEliminados = (req: Request, res: Response) => {
    Cliente.find({ activo: 0 })
        .exec((err: NativeError, clientesEliminados: ICliente[]) => {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudieron obtener los clientes eliminados' });
            return res.json(clientesEliminados);
        })
}
export let restaurarClienteEliminado = (req: Request, res: Response) => {
    Cliente.findByIdAndUpdate(req.body._id, { activo: 1 })
        .exec(function (err: NativeError, clienteRestaurado: ICliente) {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo restaurar al cliente' });
            obtenerNuevoCliente(clienteRestaurado, res, 0);
            return res.json({ titulo: 'Cliente restaurado', detalles: 'Cliente restaurado exitosamente' });
        });
}
/* Funciones para sockets */
function obtenerNuevoCliente(cliente: ICliente, res: Response, tipo: number) {
    const servidor = Servidor.instance;
    for (let usuarioConectado of Socket.usuariosConectados.lista) {
        if (usuarioConectado !== undefined && usuarioConectado._id != res.locals.usuario._id && usuarioConectado.rol == 2 && usuarioConectado.rol_sec == 0) {
            if (tipo == 0) servidor.io.in(usuarioConectado.id).emit('nuevo-cliente', cliente);//0 = nuevo cliente
            if (tipo == 1) servidor.io.in(usuarioConectado.id).emit('nuevo-cliente-eliminado', cliente);//1 = nuevo eliminado
        }
    }
}
function obtenerNuevoClienteEditado(cliente: ICliente, res: Response) {
    const servidor = Servidor.instance;
    for (let usuarioConectado of Socket.usuariosConectados.lista) {
        if (usuarioConectado !== undefined && usuarioConectado._id != res.locals.usuario._id && usuarioConectado.rol == 2 && usuarioConectado.rol_sec == 0) {
            servidor.io.in(usuarioConectado.id).emit('nuevo-cliente-editado', cliente);
        }
    }
}
