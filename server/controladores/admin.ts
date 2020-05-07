import { NextFunction, Request, Response } from 'express';
import moment from 'moment';
import { NativeError, Types } from 'mongoose';
import { Caja, ICaja } from '../modelos/caja.model';
import { EmpresaCot, IEmpresaCot } from '../modelos/empresa_cot.model';
import { Familia, IFamilia } from '../modelos/familia.model';
import { Producto } from '../modelos/producto.model';
import { IUsuario, Usuario } from '../modelos/usuario.model';
import { Venta } from '../modelos/venta.model';
import * as FuncionesSockets from '../sockets/funciones-auxiliares-sockets';

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
            sucursal: Types.ObjectId(res.locals.usuario.sucursal),
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
            sucursal: Types.ObjectId(res.locals.usuario.sucursal),
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
            sucursal: Types.ObjectId(res.locals.usuario.sucursal),
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
            sucursal: Types.ObjectId(res.locals.usuario.sucursal),
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
            sucursal: Types.ObjectId(res.locals.usuario.sucursal),
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
            sucursal: Types.ObjectId(res.locals.usuario.sucursal),
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

export let obtenerCaja = (req: Request, res: Response) => {
    Caja.findOne({ _id: req.params.id })
        .exec((err: any, caja: ICaja) => {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un error al obtener las cantidades', tipo: 2 });
            return res.json(caja);
        });
}

/* Modulo usuarios */
export let altaUsuario = (req: Request, res: Response) => {
    const usuarioAlta = new Usuario(req.body);
    usuarioAlta.sucursal = res.locals.usuario.sucursal;
    usuarioAlta.configuracion = {
        notificaciones: {
            botonCerrar: true,
            tiempo: 2000,
            posicion: 'toast-top-right',
            barraProgreso: false
        },
        tema: 'default'
    }
    usuarioAlta.save((err, usuarioCreado) => {
        if (err) return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un error al guardar el usuario' });
        FuncionesSockets.obtenerNuevoElemento(usuarioCreado, res, 0);
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
    Usuario.find({ activo: 0, sucursal: res.locals.usuario.sucursal })
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
            FuncionesSockets.obtenerNuevoElemento(usuarioRestaurado, res, 0);
            FuncionesSockets.obtenerNuevoElemento(usuarioRestaurado, res, 3);
            return res.json({ titulo: 'Usuario restaurado', detalles: 'Usuario restaurado exitosmente' });
        })
}
export let registrarUsuario = (req: Request, res: Response) => {
    const usuario = new Usuario(req.body);
    usuario.sucursal = res.locals.usuario.sucursal;
    usuario.configuracion = {
        notificaciones: {
            botonCerrar: true,
            tiempo: 2000,
            posicion: 'toast-top-right',
            barraProgreso: false
        },
        tema: 'default'
    }
    Usuario.findOne({ username: req.body.username })
        .exec((err: any, usuarioEncontrado: IUsuario) => {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo registrar el usuario' });
            if (usuarioEncontrado) return res.status(422).send({ titulo: 'Nombre de usuario repetido', detalles: 'Ya existe un usuario registrado' });
            else {
                usuario.save((err: any, usuarioRegistrado: IUsuario) => {
                    if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo registrar el usuario' });
                    FuncionesSockets.obtenerNuevoElemento(usuarioRegistrado, res, 0);
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
            FuncionesSockets.obtenerNuevoElemento(usuarioEliminado, res, 1);
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
                    FuncionesSockets.obtenerNuevoElemento(usuario, res, 2)
                    return res.json({ titulo: 'Usuario actualizado', detalles: 'Los datos fueron actualizados correctamente' });
                })

        })
}
/* Modulo proveedores */

/* Modulo cotizaciones */
export let obtenerEmpresasEliminadas = (req: Request, res: Response) => {
    EmpresaCot.find({ activa: 0, sucursal: res.locals.usuario.sucursal })
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
    Familia.find({ activa: 0, sucursal: res.locals.usuario.sucursal })
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
            FuncionesSockets.obtenerNuevoElemento(restaurada, res, 8);
            FuncionesSockets.obtenerNuevoElemento(restaurada, res, 9);
            return res.json({ titulo: 'Familia restaurada', detalles: 'Familia restaurada exitosamente' });
        })
}
