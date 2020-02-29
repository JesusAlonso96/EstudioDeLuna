import { NextFunction, Request, Response } from 'express';
import moment from 'moment';
import { Caja, ICaja } from '../modelos/caja.model';
import { CorteCaja, ICorteCaja } from '../modelos/corte_caja.model';
import { EmpresaCot, IEmpresaCot } from '../modelos/empresa_cot.model';
import { Producto } from '../modelos/producto.model';
import { IProductoProveedor, ProductoProveedor } from '../modelos/producto_proveedor.model';
import { IProveedor, Proveedor } from '../modelos/proveedor.model';
import { IUsuario, Usuario } from '../modelos/usuario.model';
import { Venta } from '../modelos/venta.model';
import Servidor from '../clases/servidor';
import * as Socket from '../sockets/socket';
import { NativeError } from 'mongoose';
import { Familia, IFamilia } from '../modelos/familia.model';


export let obtenerVentasMes = (req: Request, res: Response) => {
    var fechaInicio = new Date(moment(req.params.fechaInicio).format('YYYY-MM-DD'));
    var fechaFin = new Date(moment(req.params.fechaFin).format('YYYY-MM-DD'));
    Venta.aggregate()
        .lookup({
            from: "pedidos",
            localField: "pedido",
            foreignField: "_id",
            as: "pedido",
        })
        .unwind('pedido')
        .lookup({
            from: "productos",
            localField: "pedido.productos",
            foreignField: "_id",
            as: "productos",
        })
        .lookup({
            from: "clientes",
            localField: "pedido.cliente",
            foreignField: "_id",
            as: "cliente",
        })
        .match({
            $and: [
                { fecha: { $gte: fechaInicio } },
                { fecha: { $lte: fechaFin } }
            ]
        })
        .project({
            _id: '$pedido._id',
            num_pedido: '$pedido.num_pedido',
            status: '$pedido.status',
            fecha_creacion: '$pedido.fecha_creacion',
            fecha_entrega: '$pedido.fecha_entrega',
            comentarios: '$pedido.comentarios',
            total: '$pedido.total',
            anticipo: '$pedido.anticipo',
            foto: '$pedido.foto',
            productos: '$productos',
            dia: '$fecha',
            hora: '$hora',
            nombre_cliente: { $arrayElemAt: ['$cliente.nombre', 0] },
            ape_pat_cliente: { $arrayElemAt: ['$cliente.ape_pat', 0] },
            ape_mat_cliente: { $arrayElemAt: ['$cliente.ape_mat', 0] }

        })
        .group({
            _id: null,
            montoTotal: { $sum: '$total' },
            ventas: {
                $push: {
                    pedido: {
                        _id: '$_id',
                        num_pedido: '$num_pedido',
                        status: '$status',
                        fecha_creacion: '$fecha_creacion',
                        fecha_entrega: '$fecha_entrega',
                        comentarios: '$comentarios',
                        anticipo: '$anticipo',
                        total: '$total',
                        foto: '$foto',
                        productos: '$productos',
                        cliente: {
                            $concat: ['$nombre_cliente', ' ', '$ape_pat_cliente', ' ', '$ape_mat_cliente']
                        },
                    },
                    fecha: '$dia',
                    hora: '$hora'
                }
            }
        })
        .exec((err: any, ventas: any) => {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudieron obtener las ventas del mes' })
            if (ventas.length == 0) return res.status(422).send({ titulo: 'Sin ventas', detalles: 'No existen ventas en este dia', tipo: 0 })
            return res.json(ventas[0]);
        })
}
//posible error
export let obtenerVentasDia = (req: Request, res: Response) => {
    const fecha = new Date(moment(Date.now()).format('YYYY-MM-DD'));
    const fecha2 = new Date(fecha);
    Venta.aggregate()
        .lookup({
            from: "pedidos",
            localField: "pedido",
            foreignField: "_id",
            as: "pedido",
        })
        .unwind('pedido')
        .lookup({
            from: "productos",
            localField: "pedido.productos",
            foreignField: "_id",
            as: "productos",
        })
        .lookup({
            from: "clientes",
            localField: "pedido.cliente",
            foreignField: "_id",
            as: "cliente",
        })
        .match({
            fecha: fecha2
        })
        .project({
            _id: '$pedido._id',
            num_pedido: '$pedido.num_pedido',
            status: '$pedido.status',
            fecha_creacion: '$pedido.fecha_creacion',
            fecha_entrega: '$pedido.fecha_entrega',
            comentarios: '$pedido.comentarios',
            total: '$pedido.total',
            anticipo: '$pedido.anticipo',
            foto: '$pedido.foto',
            productos: '$productos',
            dia: '$fecha',
            hora: '$hora',
            nombre_cliente: { $arrayElemAt: ['$cliente.nombre', 0] },
            ape_pat_cliente: { $arrayElemAt: ['$cliente.ape_pat', 0] },
            ape_mat_cliente: { $arrayElemAt: ['$cliente.ape_mat', 0] }

        })
        .group({
            _id: null,
            montoTotal: { $sum: '$total' },
            ventas: {
                $push: {
                    pedido: {
                        _id: '$_id',
                        num_pedido: '$num_pedido',
                        status: '$status',
                        fecha_creacion: '$fecha_creacion',
                        fecha_entrega: '$fecha_entrega',
                        comentarios: '$comentarios',
                        anticipo: '$anticipo',
                        total: '$total',
                        foto: '$foto',
                        productos: '$productos',
                        cliente: {
                            $concat: ['$nombre_cliente', ' ', '$ape_pat_cliente', ' ', '$ape_mat_cliente']
                        },
                    },
                    fecha: '$dia',
                    hora: '$hora'
                }
            }
        })
        .exec((err: any, ventas: any[]) => {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudieron obtener las ventas del dia' })
            if (ventas.length == 0) {
                return res.status(422).send({ titulo: 'Sin ventas', detalles: 'No existen ventas en este dia', tipo: 0 })
            } else {
                return res.json(ventas);

            }
        })
}
export let obtenerVentasRango = (req: Request, res: Response) => {
    var fechaInicio = new Date(moment(req.params.fechaInicio).format('YYYY-MM-DD'));
    var fechaFin = new Date(moment(req.params.fechaFin).format('YYYY-MM-DD'));
    Venta.aggregate()
        .lookup({
            from: "pedidos",
            localField: "pedido",
            foreignField: "_id",
            as: "pedido",
        })
        .unwind('pedido')
        .lookup({
            from: "productos",
            localField: "pedido.productos",
            foreignField: "_id",
            as: "productos",
        })
        .match({
            $and: [
                { fecha: { $gte: fechaInicio } },
                { fecha: { $lte: fechaFin } }
            ]
        })
        .group({
            _id: '$fecha',
            montoTotal: { $sum: '$pedido.total' },
            clientes: { $sum: 1 }
        })
        .sort({
            _id: 1
        })
        .exec((err: any, ventas: any) => {
            if (err) {
                return res.status(422).send({ titulo: 'Error', detalles: 'No se pudieron obtener las ventas', tipo: 0 })
            } else if (ventas.length == 0) {
                return res.status(422).send({ titulo: 'Sin ventas', detalles: 'No existen ventas', tipo: 0 })
            } else {
                return res.json(ventas);

            }
        });
}
export let obtenerProductosRango = (req: Request, res: Response) => {
    var fechaInicio = new Date(moment(req.params.fechaInicio).format('YYYY-MM-DD'));
    var fechaFin = new Date(moment(req.params.fechaFin).format('YYYY-MM-DD'));
    Producto.aggregate()
        .match({
            $and: [
                { fecha: { $gte: fechaInicio } },
                { fecha: { $lte: fechaFin } }
            ]
        })
        .group({
            _id: null,
            count: { $sum: 1 }
        })
        .exec((err: any, ventas: any) => {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudieron obtener las ventas', tipo: 0 })
            if (ventas.length == 0) return res.status(422).send({ titulo: 'Sin ventas', detalles: 'No existen ventas', tipo: 0 })
            return res.json(ventas);
        });
}
export let obtener10ProductosMasVendidos = (req: Request, res: Response) => {
    var fechaInicio = new Date(moment(req.params.fechaInicio).format('YYYY-MM-DD'));
    var fechaFin = new Date(moment(req.params.fechaFin).format('YYYY-MM-DD'));
    Venta.aggregate()
        .match({
            $and: [
                { fecha: { $gte: fechaInicio } },
                { fecha: { $lte: fechaFin } }
            ]
        })
        .lookup({
            from: "pedidos",
            localField: "pedido",
            foreignField: "_id",
            as: "pedido",
        })
        .unwind('pedido')
        .unwind('pedido.productos')
        .lookup({
            from: "productos",
            localField: "pedido.productos",
            foreignField: "_id",
            as: "pedido.productos",
        })
        .unwind('pedido.productos')
        .group({
            _id: '$pedido.productos',
            cantidad: { $sum: 1 }
        })
        .sort({
            cantidad: -1
        })
        .limit(15)
        .exec((err, ventas) => {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un error al obtener las ventas' })
            if (ventas.length == 0) return res.status(422).send({ titulo: 'Sin ventas', detalles: 'No existen ventas', tipo: 0 });
            return res.json(ventas);
        });
}
export let obtenerVentasPorFamilias = (req: Request, res: Response) => {
    var fechaInicio = new Date(moment(req.params.fechaInicio).format('YYYY-MM-DD'));
    var fechaFin = new Date(moment(req.params.fechaFin).format('YYYY-MM-DD'));
    Venta.aggregate()
        .match({
            $and: [
                { fecha: { $gte: fechaInicio } },
                { fecha: { $lte: fechaFin } }
            ]
        })
        .lookup({
            from: "pedidos",
            localField: "pedido",
            foreignField: "_id",
            as: "pedido",
        })
        .unwind('pedido')
        .unwind('pedido.productos')
        .lookup({
            from: "productos",
            localField: "pedido.productos",
            foreignField: "_id",
            as: "pedido.productos",
        })
        .unwind('pedido.productos')
        .lookup({
            from: "familias",
            localField: "pedido.productos.familia",
            foreignField: "_id",
            as: "pedido.productos.familia",
        })
        .unwind('pedido.productos.familia')
        .group({
            _id: '$pedido.productos.familia',
            cantidad: {
                $sum: '$pedido.productos.precio'
            },
        })
        .exec((err: any, ventas: any) => {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un error al obtener las ventas' })
            if (ventas.length == 0) return res.status(422).send({ titulo: 'Sin ventas', detalles: 'No existen ventas', tipo: 0 })
            return res.json(ventas);
        });
}
/* Corte de caja */
export let existeCorte = (req: Request, res: Response) => {
    const fecha = new Date(moment(Date.now()).format('YYYY-MM-DD'));
    CorteCaja.findOne({ fecha })
        .exec((err: any, corte: ICorteCaja) => {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo verificar la existencia del corte de caja', tipo: 2 })
            if (corte) {
                return res.json({ encontrado: true });
            } else {
                return res.json({ encontrado: false });
            }
        })
}
//posible error
export let crearCorteCaja = (req: Request, res: Response) => {
    var fecha = new Date(moment(Date.now()).format('YYYY-MM-DD'));
    var hora = new Date(moment(Date.now()).format('h:mm:ss a'));
    const corte = new CorteCaja({
        fecha,
        hora,
        usuario: res.locals.usuario,
        efectivoEsperado: req.body.efectivoEsperado,
        tarjetaEsperado: req.body.tarjetaEsperado,
        efectivoContado: req.body.efectivoContado,
        tarjetaContado: req.body.tarjetaContado,
        fondoEfectivo: req.body.fondoEfectivo,
        fondoTarjetas: req.body.fondoTarjetas
    });
    corte.save((err: any, guardado: any) => {
        if (err) return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un error al guardar el corte de caja', tipo: 2 })
        return res.json(guardado);
    });
}
export let obtenerCaja = (req: Request, res: Response) => {
    Caja.findOne()
        .exec((err: any, caja: ICaja) => {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un error al obtener las cantidades', tipo: 2 });
            return res.json(caja);
        });
}
export let actualizarCaja = (req: Request, res: Response) => {
    Caja.findOneAndUpdate({}, {
        cantidadTotal: req.body.cantidadTotal,
        cantidadEfectivo: req.body.cantidadEfectivo,
        cantidadTarjetas: req.body.cantidadTarjetas
    })
        .exec((err: any, cajaActualizada: ICaja) => {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un error al actualizar la caja', tipo: 2 });
            return res.json(cajaActualizada);
        })
}
export let obtenerCortesCaja = (req: Request, res: Response) => {
    CorteCaja.find()
        .sort({
            num_corte: 'desc'
        })
        .exec((err: any, cortes: ICorteCaja[]) => {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un error al obtener el historial', tipo: 2 })
            return res.json(cortes);
        });
}
/* Modulo usuarios */
export let altaUsuario = (req: Request, res: Response) => {
    const usuarioAlta = new Usuario(req.body);
    usuarioAlta.save((err, usuarioCreado) => {
        if (err) return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un error al guardar el usuario' });
        obtenerNuevoElemento(usuarioCreado, res, 0);
        return res.json({ titulo: 'Usuario guardado con exito', detalles: usuarioCreado });
    })
}
export let cambiarPermisos = (req: Request, res: Response) => {
    Usuario.findByIdAndUpdate(req.body._id, {
        rol: req.body.rol,
        rol_sec: req.body.rol_sec
    })
        .exec((err: any, actualizado: IUsuario) => {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudieron cambiar los permisos del usuario' });
            return res.json({ titulo: 'Permisos cambiados', detalles: 'Permisos cambiados exitosamente' });
        })
}
export let obtenerUsuariosEliminados = (req: Request, res: Response) => {
    Usuario.find({ activo: 0 })
        .exec((err: any, usuariosEncontrados: IUsuario[]) => {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudieron obtener los usuarios eliminados' });
            return res.json(usuariosEncontrados);
        });
}
export let restaurarUsuarioEliminado = (req: Request, res: Response) => {
    Usuario.findByIdAndUpdate(req.body._id, {
        activo: 1
    })
        .exec((err: any, usuarioRestaurado: IUsuario) => {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo restaurar el usuario' });
            obtenerNuevoElemento(usuarioRestaurado, res, 0);
            obtenerNuevoElemento(usuarioRestaurado, res, 3);
            return res.json({ titulo: 'Usuario restaurado', detalles: 'Usuario restaurado exitosmente' });
        })
}
export let registrarUsuario = (req: Request, res: Response) => {
    const usuario = new Usuario(req.body);
    Usuario.findOne({ username: req.body.username })
        .exec((err: any, usuarioEncontrado: IUsuario) => {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo registrar el usuario' });
            if (usuarioEncontrado) return res.status(422).send({ titulo: 'Nombre de usuario repetido', detalles: 'Ya existe un usuario registrado' });
            else {
                usuario.save((err: any, usuarioRegistrado: IUsuario) => {
                    if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo registrar el usuario' });
                    obtenerNuevoElemento(usuarioRegistrado, res, 0);
                    return res.json({ titulo: 'Usuario registrado', detalles: 'Registro completado exitosamente' });
                });
            }
        });
}
export let eliminarUsuario = (req: Request, res: Response) => {
    Usuario.findByIdAndUpdate(req.body._id, {
        activo: 0
    })
        .exec((err: any, usuarioEliminado: IUsuario) => {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo eliminar el usuario' });
            obtenerNuevoElemento(usuarioEliminado, res, 1);
            return res.json({ titulo: 'Usuario elimnado', detalles: 'Usuario eliminado exitosamente' });
        })
}
export let editarUsuario = (req: Request, res: Response) => {
    const usuario = new Usuario(req.body);
    Usuario.findByIdAndUpdate(req.body._id, {
        nombre: usuario.nombre,
        ape_pat: usuario.ape_pat,
        ape_mat: usuario.ape_mat,
        username: usuario.username,
        email: usuario.email,
        telefono: usuario.telefono
    })
        .exec((err: NativeError, usuarioActualizado: IUsuario) => {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo actualizar el usuario' });
            Usuario.findById(usuarioActualizado._id)
                .exec((err: NativeError, usuario: IUsuario) => {
                    obtenerNuevoElemento(usuario, res, 2)
                    return res.json({ titulo: 'Usuario actualizado', detalles: 'Los datos fueron actualizados correctamente' });
                })

        })
}
/* Modulo proveedores */
export let editarProveedor = (req: Request, res: Response) => {
    Proveedor.findByIdAndUpdate(req.body._id, {
        nombre: req.body.nombre,
        rfc: req.body.rfc,
        email: req.body.email,
        ciudad: req.body.ciudad,
        estado: req.body.estado,
        telefono: req.body.telefono,
        direccion: req.body.direccion,
        colonia: req.body.colonia,
        cp: req.body.cp,
        num_ext: req.body.num_ext,
        num_int: req.body.num_int
    })
        .exec((err: any, proveedorActualizado: IProveedor) => {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo actualizar al proveedor' });
            Proveedor.findById(proveedorActualizado._id)
                .exec((err: NativeError, proveedor: IProveedor) => {
                    obtenerNuevoElemento(proveedor, res, 5);
                    return res.json({ titulo: 'Datos actualizados', detalles: 'Datos del proveedor actualizados correctamente' });
                })
        });
}
export let eliminarProveedor = (req: Request, res: Response) => {
    Proveedor.findByIdAndUpdate(req.body._id, {
        activo: 0
    })
        .exec((err: any, eliminado: IProveedor) => {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo eliminar al proveedor' });
            obtenerNuevoElemento(eliminado, res, 7);
            return res.json({ titulo: 'Proveedor eliminado', detalles: 'Proveedor eliminado exitosamente' });
        })
}
export let restaurarProveedor = (req: Request, res: Response) => {
    Proveedor.findByIdAndUpdate(req.body._id, {
        activo: 1
    })
        .exec((err: any, proveedorActualizado: IProveedor) => {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo restaurar al proveedor' });
            obtenerNuevoElemento(proveedorActualizado, res, 4);
            obtenerNuevoElemento(proveedorActualizado, res, 6);
            return res.json({ titulo: 'Proveedor restaurado', detalles: 'Proveedor eliminado restaurado correctamente' });
        })
}
export let obtenerProveedoresEliminados = (req: Request, res: Response) => {
    Proveedor.find({ activo: 0 })
        .exec((err: any, usuariosEncontrados: IProveedor) => {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudieron obtener los proveedores eliminados' });
            return res.json(usuariosEncontrados);
        });
}
export let eliminarProductoProveedor = (req: Request, res: Response) => {
    ProductoProveedor.findByIdAndUpdate(req.body._id, {
        activo: 0
    })
        .exec((err: any, eliminado: IProductoProveedor) => {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo eliminar el producto' });
            if (eliminado) {
                ProductoProveedor.find({ activo: 1, proveedor: req.body.proveedor })
                    .exec((err, productos) => {
                        if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudieron obtener los productos actualizados' });
                        return res.json(productos);
                    })
            }
        });
}
export let editarProductoProveedor = (req: Request, res: Response) => {
    ProductoProveedor.findByIdAndUpdate(req.body._id, {
        nombre: req.body.nombre,
        costo: req.body.costo,
        detalles: req.body.detalles
    })
        .exec((err: any, actualizado: IProductoProveedor) => {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo actualizar el producto' });
            if (actualizado) {
                ProductoProveedor.find({ proveedor: req.body.proveedor })
                    .exec((err, productos) => {
                        if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudieron obtener los productos actualizados' });
                        return res.json(productos);
                    })
            }
        });
}
export let obtenerProductosProveedorEliminados = (req: Request, res: Response) => {
    ProductoProveedor.find({ activo: 0 })
        .populate('proveedor')
        .exec((err: any, productos: IProductoProveedor[]) => {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudieron obtener los productos eliminados' });
            return res.json(productos);
        })
}
export let restaurarProductoProveedorEliminado = (req: Request, res: Response) => {
    ProductoProveedor.findByIdAndUpdate(req.body._id, {
        activo: 1
    })
        .exec((err: any, actualizado: IProductoProveedor) => {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo restaurar el producto' });
            if (actualizado) return res.json({ titulo: 'Producto restaurado', detalles: 'Producto restaurado exitosamente' });
        })
}
/* Modulo cotizaciones */
export let obtenerEmpresasEliminadas = (req: Request, res: Response) => {
    EmpresaCot.find({ activa: 0 })
        .exec((err: any, empresasEliminadas: IEmpresaCot) => {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudieron obtener las empresas eliminadas' });
            if (empresasEliminadas) return res.json(empresasEliminadas);
        });
}
export let restaurarEmpresaEliminada = (req: Request, res: Response) => {
    EmpresaCot.findByIdAndUpdate(req.body._id, {
        activa: 1
    })
        .exec((err: any, restaurada: IEmpresaCot) => {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo restaurar el producto' });
            if (restaurada) return res.json({ titulo: 'Empresa restaurada', detalles: 'Empresa restaurada exitosamente' });
        })
}
export let adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if (res.locals.usuario.rol == 2 && res.locals.usuario.rol_sec == 0) {
        next();
    } else {
        return res.status(422).send({ titulo: 'No autorizado', detalles: 'No tienes permisos para realizar esta accion' })
    }
}
export let obtenerFamiliasEliminadas = (req: Request, res: Response) => {
    Familia.find({ activa: 0 })
        .exec((err: NativeError, familias: IFamilia[]) => {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudieron obtener las familias eliminadas' });
            return res.json(familias);
        })
}
export let restaurarFamiliaEliminada = (req: Request, res: Response) => {
    Familia.findByIdAndUpdate(req.body._id, {
        activa: 1
    })
        .exec((err: any, restaurada: IFamilia) => {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo restaurar la familia de productos' });
            obtenerNuevoElemento(restaurada, res, 8);
            obtenerNuevoElemento(restaurada, res, 9);
            return res.json({ titulo: 'Familia restaurada', detalles: 'Familia restaurada exitosamente' });
        })
}
/* Funciones para sockets */
function obtenerNuevoElemento(elemento: any, res: Response, tipo: number) {
    const servidor = Servidor.instance;
    for (let usuarioConectado of Socket.usuariosConectados.lista) {
        if (usuarioConectado !== undefined && usuarioConectado._id != res.locals.usuario._id && usuarioConectado.rol == 2 && usuarioConectado.rol_sec == 0) {
            switch (tipo) {
                case 0: servidor.io.in(usuarioConectado.id).emit('nuevo-usuario', elemento); break;
                case 1: servidor.io.in(usuarioConectado.id).emit('nuevo-usuario-eliminado', elemento); break;
                case 2: servidor.io.in(usuarioConectado.id).emit('nuevo-usuario-editado', elemento); break;
                case 3: servidor.io.in(usuarioConectado.id).emit('nuevo-usuario-restaurado', elemento); break;
                case 4: servidor.io.in(usuarioConectado.id).emit('nuevo-proveedor', elemento); break;
                case 5: servidor.io.in(usuarioConectado.id).emit('nuevo-proveedor-editado', elemento); break;
                case 6: servidor.io.in(usuarioConectado.id).emit('nuevo-proveedor-restaurado', elemento); break;
                case 7: servidor.io.in(usuarioConectado.id).emit('nuevo-proveedor-eliminado', elemento); break;
                case 8: servidor.io.in(usuarioConectado.id).emit('nueva-familia', elemento); break;
                case 9: servidor.io.in(usuarioConectado.id).emit('nueva-familia-restaurada', elemento); break;
            }
        }
    }
}