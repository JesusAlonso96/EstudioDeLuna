import * as bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import moment from 'moment';
import { NativeError, Types } from 'mongoose';
import nodemailer from 'nodemailer';
import Servidor from '../clases/servidor';
import { environment } from '../global/environment';
import { Almacen, IAlmacen } from '../modelos/almacen.model';
import { Asistencia, IAsistencia } from '../modelos/asistencia.model';
import { Caja, ICaja } from '../modelos/caja.model';
import { Compra, ICompra } from '../modelos/compra.model';
import { Cotizacion, ICotizacion } from '../modelos/cotizacion.model';
import { EmpresaCot, IEmpresaCot } from '../modelos/empresa_cot.model';
import { Familia, IFamilia } from '../modelos/familia.model';
import { IOrdenCompra, OrdenCompra } from '../modelos/orden_compra.model';
import { IPedido, Pedido } from '../modelos/pedido.model';
import { IPestana, Pestana } from '../modelos/pestana.model';
import { IProducto, Producto } from '../modelos/producto.model';
import { ProductoProveedor } from '../modelos/producto_proveedor.model';
import { ISucursal, Sucursal } from '../modelos/sucursal.model';
import { IUsuario, Usuario } from '../modelos/usuario.model';
import { IVenta, Venta } from '../modelos/venta.model';
import * as Socket from '../sockets/socket';

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    secure: false,
    auth: {
        user: 'j.alonso.jacl2@gmail.com',
        pass: 'papanatas.123'
    }
})

export let login = (req: Request, res: Response) => {
    const { username, contrasena } = req.body;
    Usuario.findOne({ username })
        .exec((err: NativeError, usuarioEncontrado: IUsuario) => {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un error al iniciar sesión, intentalo de nuevo mas tarde' });
            if (!usuarioEncontrado) {
                return res.status(422).send({ titulo: 'Usuario no encontrado', detalles: 'No existe un usuario con estos datos' });
            } else {
                if (usuarioEncontrado.activo == 0) {
                    return res.status(422).send({ titulo: 'Usuario no encontrado', detalles: 'No existe un usuario con estos datos' });
                }
                if (verificarContrasena(contrasena, usuarioEncontrado.contrasena)) {
                    console.log(usuarioEncontrado.configuracion)
                    const token = jwt.sign({
                        id: usuarioEncontrado._id,
                        nombre: usuarioEncontrado.nombre,
                        ape_pat: usuarioEncontrado.ape_pat,
                        ape_mat: usuarioEncontrado.ape_mat,
                        correo: usuarioEncontrado.email,
                        rol: usuarioEncontrado.rol,
                        rol_sec: usuarioEncontrado.rol_sec,
                        configuracion: usuarioEncontrado.configuracion,
                        logo: usuarioEncontrado.logo,
                        sucursal: usuarioEncontrado.sucursal
                    }, environment.SECRET, { expiresIn: '8h' });
                    return res.json(token);
                } else {
                    return res.status(422).send({ titulo: 'Datos incorrectos', detalles: 'Correo electronico o contraseña erroneos' })
                }
            }
        });
}
export let obtenerPestanas = (req: Request, res: Response) => {
    Pestana.find({ rol: req.params.rol })
        .sort({ nombre: 1 })
        .exec((err: NativeError, pestanas: IPestana[]) => {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: `Error al obtener los módulos de ${req.params.rol}` });
            if (pestanas) return res.json(pestanas);
        })
}
export let crearAsistencia = (req: Request, res: Response) => {
    let hoy = new Date(moment(Date.now()).format('YYYY-MM-DD'));
    const asistencia = new Asistencia({ fecha: hoy, asistencia: true });
    asistencia.save((err: NativeError, creada: IAsistencia) => {
        if (err) return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un error al crear la asistencia' });
        if (creada) {
            Usuario.updateOne({ _id: req.params.id }, {
                $push: { asistencia }
            })
                .exec((err: NativeError, actualizado: IUsuario) => {
                    if (err) return res.status(422).send({ titulo: 'Error', detalles: 'Ocurrio un error al crear la asistencia' });
                    return res.json(actualizado);
                });
        }
    });
}
export let generarCodigoRecuperacion = (req: Request, res: Response) => {
    const codigo = generarCodigo();
    const email = req.body.email;
    Usuario.findOne({ email }).exec((err: NativeError, usuario: IUsuario | null) => {
        if (err) return res.status(422).send({ titulo: 'Error al generar codigo', detalles: 'Ocurrio un error al generar el codigo de recuperacion de contrasena' });
        if (!usuario) {
            return res.status(422).send({ titulo: 'Error al generar codigo', detalles: 'No existe un usuario con este correo electronico' });
        }
    })
    Usuario.findOneAndUpdate({ email }, {
        codigoRecuperacion: codigo
    })
        .exec((err: NativeError, actualizado: IUsuario) => {
            if (err) return res.status(422).send({ titulo: 'Error al generar codigo', detalles: 'Ocurrio un error al generar el codigo de recuperacion de contrasena' });
            if (actualizado) {
                let opciones = {
                    from: '"Estudio de Luna" <j.alonso.jacl2@gmail.com>',
                    to: email,
                    subject: 'Recuperacion de contrasena',
                    html: `<b>El codigo de recuperacion es ${codigo}</b>` // html body

                }
                transporter.sendMail(opciones, (err: Error | null, info: any) => {
                    if (err) res.status(422).send({ titulo: 'Error al enviar correo', detalles: 'Ocurrio un error al enviar el correo electronico, por favor intentalo de nuevo mas tarde' });
                    console.log("Message sent: %s", info.messageId);
                    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
                    return res.json({ titulo: 'Correo enviado', detalles: 'Se ha enviado un correo para actualizar tu contrasena' });
                })
            }
        })
}
export let recuperarContrasena = (req: Request, res: Response) => {
    const { contrasena, codigo } = req.body;
    Usuario.findOne({ email: req.params.email })
        .exec((err: NativeError, usuarioEncontrado: IUsuario) => {
            if (err) return res.status(422).send({ titulo: 'Error al obtener', detalles: 'Error al obtener datos del usuario, intentelo de nuevo mas tarde' });
            if (codigo !== usuarioEncontrado.codigoRecuperacion) return res.status(422).send({ titulo: 'Codigo erroneo', detalles: 'El codigo ingresado no coincide con el generado' });
            else {
                bcrypt.genSalt(10, function (err, salt) {
                    bcrypt.hash(contrasena, salt, function (err, hash) {
                        Usuario.findOneAndUpdate({ email: req.params.email }, {
                            $set: { contrasena: hash, codigoRecuperacion: '' }
                        })
                            .exec((err: NativeError, usuarioActualizado: IUsuario) => {
                                if (err) return res.status(422).send({ titulo: 'Error al actualizar contrasena', detalles: 'Ocurrio un error al actualizar la contrasena, intentalo de nuevo mas tarde' });
                                return res.status(200).send({ titulo: 'Contrasena actualizada', detalles: 'Se actualizo satisfactoriamente la contrasena' });
                            })
                    })
                })

            }
        })
}
export let eliminarCodigoRecuperacion = (req: Request, res: Response) => {
    Usuario.findOneAndUpdate({ email: req.body.email }, {
        codigoRecuperacion: ''
    })
        .exec((err: NativeError, usuarioActualizado: IUsuario) => {
            if (err) return res.status(422).send({ titulo: 'Error al actualizar', detalles: 'Error al actualizar el codigo de recuperacion' });
            return res.status(200).json({ titulo: 'Codigo eliminado', detalles: 'El codigo de recuperacion ha sido eliminado' });
        })
}
export let obtenerUsuario = (req: Request, res: Response) => {
    Usuario.findById(req.params.id)
        .exec((err: NativeError, usuarioEncontrado: IUsuario) => {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se encontro el usuario solicitado' });
            return res.json(usuarioEncontrado);
        })
}

export let eliminarProducto = (req: Request, res: Response) => {
    Producto.findOneAndUpdate({ _id: req.params.id }, {
        activo: 0
    }).exec((err: NativeError, eliminado: IProducto) => {
        if (err) {
            return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo eliminar el producto' });
        }
        return res.json(eliminado);
    })
}
export let actualizarProducto = (req: Request, res: Response) => {
    Producto.findOneAndUpdate({ _id: req.body._id }, {
        nombre: req.body.nombre,
        num_fotos: req.body.num_fotos,
        precio: req.body.precio,
        descripcion: req.body.descripcion,
        b_n: req.body.b_n,
        c_r: req.body.c_r,
        c_ad: req.body.c_ad,
        ancho: req.body.ancho,
        alto: req.body.alto,
        caracteristicas: req.body.caracteristicas
    })
        .exec((err: NativeError, actualizado: IProducto) => {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo actualizar el producto' });
            return res.json(actualizado);
        })
}
export let agregarFamilia = (req: Request, res: Response) => {
    const familia = new Familia(req.body);
    familia.sucursal = res.locals.usuario.sucursal;
    Familia.findOne({ nombre: familia.nombre })
        .exec((err: NativeError, familiaEncontrada: IFamilia) => {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo agregar la familia' });
            if (familiaEncontrada) {
                return res.status(422).send({ titulo: 'Error', detalles: 'Ya existe una familia con este nombre', tipo: 2 })
            } else {
                familia.save((err: NativeError, guardada: IFamilia) => {
                    if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo agregar la familia' });
                    obtenerNuevoElementoAdminOSupervisor(guardada, res, 2);
                    return res.json(guardada);
                })
            }
        })
}
export let eliminarFamilia = (req: Request, res: Response) => {
    Familia.findByIdAndUpdate(req.params.id, {
        activa: 0
    })
        .exec((err: NativeError, eliminada: IFamilia) => {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudo eliminar la familia' });
            obtenerNuevoElementoAdminOSupervisor(eliminada, res, 1);
            return res.json(eliminada);
        });
}
export let obtenerUsuarios = (req: Request, res: Response) => {
    Usuario.find({ activo: 1, sucursal: res.locals.usuario.sucursal }, { contrasena: 0 })
        .exec((err: NativeError, usuariosEncontrados: IUsuario[]) => {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudieron obtener los usuarios' });
            return res.json(usuariosEncontrados);
        })
}
export let obtenerPedidosRealizados = (req: Request, res: Response) => {
    Pedido.find({ status: 'Finalizado' })
        .populate('productos')
        .populate('fotografo', '-pedidosTomados -asistencia -contrasena')
        .populate('cliente', '-contrasena -pedidos')
        .exec((err: NativeError, pedidos: IPedido[]) => {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudieron obtener los pedidos' });
            console.log("holaaaaaaaaaaaaaa", pedidos);
            return res.json(pedidos);
        })
}
export let obtenerPedidosVendidos = (req: Request, res: Response) => {
    const filtro: number = Number(req.params.filtro);
    if (filtro == 1) {
        let fecha = new Date(moment(Date.now()).format('YYYY-MM-DD'));
        pedidosVendidosDia(fecha, res);
    } else if (filtro == 2) {
        pedidosVendidos(res);
    }
}
export let obtenerFotografos = (req: Request, res: Response) => {
    Usuario.find({ rol: 0, rol_sec: 1, activo: 1 })
        .exec((err: NativeError, fotografos: IUsuario[]) => {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudieron obtener los empleados' });
            return res.json(fotografos);
        });
}
export let obtenerPedidosRealizadosPorFotografo = (req: Request, res: Response) => {
    Pedido.aggregate()
        .lookup({
            from: "usuarios",
            localField: "fotografo",
            foreignField: "_id",
            as: "fotografo"
        })
        .unwind('fotografo')
        .lookup({
            from: "clientes",
            localField: "cliente",
            foreignField: "_id",
            as: "cliente"
        })
        .unwind('cliente')
        .match({
            'fotografo._id': Types.ObjectId(req.params.id),
            status: 'Finalizado',
        })
        .sort({
            num_pedido: 'asc'
        })
        .exec((err: NativeError, pedidos: IPedido[]) => {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudieron obtener los pedidos' });
            return res.json(pedidos);
        });
}
export let obtenerPedidosVendidosPorFotografo = (req: Request, res: Response) => {
    let fecha = new Date(moment(Date.now()).format('YYYY-MM-DD'));
    const filtro: number = Number(req.params.filtro);
    if (filtro == 1) {
        pedidosVendidosPorEmpleadoDia(fecha, res, req.params.id);
    } else if (filtro == 2) {
        pedidosVendidosPorEmpleado(res, req.params.id);
    }
}
export let obtenerVentasConRetoquePorFotografo = (req: Request, res: Response) => {
    let fecha = new Date(moment(Date.now()).format('YYYY-MM-DD'));
    Venta.aggregate()
        .lookup({
            from: "pedidos",
            localField: "pedido",
            foreignField: "_id",
            as: "pedido",
        })
        .unwind('pedido')
        .unwind('pedido.fotografo')
        .lookup({
            from: "usuarios",
            localField: "pedido.fotografo",
            foreignField: "_id",
            as: "pedido.fotografo",
        })
        .unwind('pedido.fotografo')
        .match({
            fecha,
            'pedido.c_retoque': true
        })
        .group({
            _id: '$pedido.fotografo',
            montoVendido: { $sum: '$pedido.total' },
            pedidos: { $sum: 1 }
        })
        .exec((err: NativeError, ventas: any[]) => {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudieron obtener los pedidos' });
            return res.json(ventas);
        })
}
export let desglosarVentasConRetoquePorFotografo = (req: Request, res: Response) => {
    let fecha = new Date(moment(Date.now()).format('YYYY-MM-DD'));
    Venta.aggregate()
        .lookup({
            from: "pedidos",
            localField: "pedido",
            foreignField: "_id",
            as: "pedido",
        })
        .unwind('pedido')
        .unwind('pedido.fotografo')
        .unwind('pedido.productos')
        .lookup({
            from: "usuarios",
            localField: "pedido.fotografo",
            foreignField: "_id",
            as: "pedido.fotografo",
        })
        .unwind('pedido.fotografo')
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
        .match({
            fecha,
            'pedido.c_retoque': true,
            'pedido.fotografo._id': Types.ObjectId(req.params.id)

        })
        .group({
            _id: '$pedido.productos.familia.nombre',
            montoVendido: { $sum: '$pedido.total' },
            pedidos: { $sum: 1 }
        })
        .exec((err: NativeError, ventas: any[]) => {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudieron obtener los pedidos' });
            return res.json(ventas);
        })
}


/* Modulo cotizaciones */

/* Modulo de inventarios */
export let obtenerOrdenesCompra = (req: Request, res: Response) => {
    OrdenCompra.find({ activa: true, sucursal: res.locals.usuario.sucursal })
        .populate('usuario')
        .populate('proveedor')
        .populate('productosOrdenCompra.insumo')
        .exec((err: NativeError, ordenes: IOrdenCompra[]) => {
            if (err) return res.status(422).send({ titulo: 'Error al obtener ordenes', detalles: 'Ocurrio un error al obtener las ordenes de compra, intentalo de nuevo mas tarde' });
            return res.status(200).json(ordenes);
        })
}
export let nuevaOrdenCompra = (req: Request, res: Response) => {
    const orden = new OrdenCompra(req.body);
    orden.sucursal = res.locals.usuario.sucursal;
    orden.usuario = res.locals.usuario;
    orden.save((err: any, ordenGuardada: IOrdenCompra) => {
        if (err) {
            console.log(err);
            return res.status(422).send({ titulo: 'Error al crear orden', detalles: 'Ocurrio un error al crear la orden de compra, intentalo de nuevo mas tarde' });
        }
        return res.status(200).json(ordenGuardada);
    })
}
export let desactivarOrdenComra = (req: Request, res: Response) => {
    OrdenCompra.findByIdAndUpdate(req.params.id, {
        activa: false
    }).exec((err: NativeError, ordenEliminada: IOrdenCompra) => {
        if (err) return res.status(422).send({ titulo: 'Error al actualizar orden de compra', detalles: 'Ocurrio un error al desactivar la orden de compra, intentalo de nuevo mas tarde' });
        return res.json(ordenEliminada);
    });
}
export let registrarCompra = (req: Request, res: Response) => {
    const compra = new Compra(req.body);
    compra.sucursal = res.locals.usuario.sucursal;
    Almacen.findById(compra.almacen._id)
        .populate('insumos.insumo')
        .exec((err: NativeError, almacen: IAlmacen) => {
            if (err) return res.status(422).send({ titulo: 'Error al registrar compra', detalles: 'Ocurrio un error al registrar la compra, intentalo de nuevo mas tarde' });
            if (almacen.insumos.length > 0) {
                for (let i = 0; i < compra.insumosCompra.length; i++) {
                    const insumoEncontrado = almacen.insumos.find(insumo => Types.ObjectId(insumo.insumo._id).equals(compra.insumosCompra[i].insumo._id));
                    if (insumoEncontrado) {
                        const indice = almacen.insumos.indexOf(insumoEncontrado);
                        almacen.insumos[indice].existencia = almacen.insumos[indice].existencia + compra.insumosCompra[i].cantidad;
                    } else {
                        almacen.insumos.push({
                            insumo: compra.insumosCompra[i].insumo,
                            existencia: compra.insumosCompra[i].cantidad
                        })
                    }
                }
            } else {
                for (let i = 0; i < compra.insumosCompra.length; i++) {
                    almacen.insumos.push({
                        insumo: compra.insumosCompra[i].insumo,
                        existencia: compra.insumosCompra[i].cantidad
                    })
                }
            }
            Almacen.findByIdAndUpdate(almacen._id, {
                insumos: almacen.insumos
            }).exec((err: NativeError, almacen: IAlmacen) => {
                if (err) {
                    console.log(err)
                    return res.status(422).send({ titulo: 'Error al registrar compra', detalles: 'Ocurrio un error al registrar la compra, intentalo de nuevo mas tarde' });
                }
                const historialEgreso: any = {
                    usuario: res.locals.usuario,
                    tipo: 'Salida',
                    descripcion: 'Se realizo una compra a proveedor',
                    cantidadSalida: compra.total,
                    cantidadEntrada: 0
                }
                Caja.findOne().exec((err: NativeError, caja: ICaja) => {
                    if (err) {
                        console.log(err)
                        return res.status(422).send({ titulo: 'Error al registrar compra', detalles: 'Ocurrio un error al registrar la compra, intentalo de nuevo mas tarde' });
                    }
                    let cajaCantidad = 0;
                    let cajaEfectivo = 0;
                    let cajaTarjetas = 0;
                    if (compra.metodoPago === 'Efectivo') {
                        if (compra.total > caja.cantidadEfectivo) return res.status(422).send({ titulo: 'No se puede registrar la compra', detalles: 'No existen fondos suficientes en caja para realizar la compra' });
                        cajaCantidad = caja.cantidadTotal - compra.total;
                        cajaEfectivo = caja.cantidadEfectivo - compra.total;
                        cajaTarjetas = caja.cantidadTarjetas;
                    }
                    if (compra.metodoPago === 'Tarjeta') {
                        if (compra.total > caja.cantidadTarjetas) return res.status(422).send({ titulo: 'No se puede registrar la compra', detalles: 'No existen fondos suficientes en caja para realizar la compra' });
                        cajaCantidad = caja.cantidadTotal - compra.total;
                        cajaTarjetas = caja.cantidadTarjetas - compra.total;
                        cajaEfectivo = caja.cantidadEfectivo;
                    }
                    Caja.updateOne({ _id: caja._id }, {
                        cantidadTotal: cajaCantidad,
                        cantidadEfectivo: cajaEfectivo,
                        cantidadTarjetas: cajaTarjetas,
                        $push: {
                            historialEgresosIngresos: historialEgreso
                        }
                    }).exec((err: NativeError, actualizada: ICaja | null) => {
                        if (err) {
                            console.log(err)
                            return res.status(422).send({ titulo: 'Error al registrar compra', detalles: 'Ocurrio un error al registrar la compra, intentalo de nuevo mas tarde' });
                        } if (!actualizada) res.status(422).send({ titulo: 'Error al registrar compra', detalles: 'Ocurrio un error al actualizar la caja, intentalo de nuevo mas tarde' })
                        else {
                            for (let producto of compra.insumosCompra) {
                                ProductoProveedor.findByIdAndUpdate(producto.insumo._id, {
                                    $push: {
                                        historialMov: {
                                            numFactura: compra.numFactura,
                                            usuario: res.locals.usuario,
                                            tipo: 'Ingreso',
                                            cantidadMovimiento: producto.cantidad
                                        }
                                    }
                                }).exec((err: NativeError, producto: IProducto | null) => {
                                    if (err) res.status(422).send({ titulo: 'Error al registrar compra', detalles: 'Ocurrio un error al registrar la compra, intentalo de nuevo mas tarde' });
                                    if (!producto) res.status(422).send({ titulo: 'Error al registrar compra', detalles: 'Ocurrio un error al registrar la compra, intentalo de nuevo mas tarde' });
                                })
                            }
                            compra.usuario = res.locals.usuario;
                            compra.save((err: any, compra: ICompra) => {
                                if (err) {
                                    console.log(err);
                                    res.status(422).send({ titulo: 'Error al registrar compra', detalles: 'Ocurrio un error al registrar la compra, intentalo de nuevo mas tarde' });

                                }
                                return res.json(compra);
                            })
                        }
                    })

                });
            });
        })
}
export let obtenerSucursales = (req: Request, res: Response) => {
    Sucursal.find({ activa: true, _id: res.locals.usuario.sucursal }).exec((err: NativeError, sucursales: ISucursal[]) => {
        if (err) res.status(422).send({ titulo: 'Error al obtener sucursales', detalles: 'Ocurrio un error al obtener sucursales, intentalo de nuevo mas tarde' });
        return res.json(sucursales);
    })
}
/* Modulo de configuracion */

/* Middlewares */



/* Funciones auxiliares */

export function encriptarContrasena(contrasena: string) {
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(contrasena, salt, function (err, hash) {
            contrasena = hash;
        })
    })
}
function verificarContrasena(contrasena: string, contrasenaModel: string) {
    return bcrypt.compareSync(contrasena, contrasenaModel);
}
function pedidosVendidosDia(fecha: Date, res: Response) {
    Venta.find({ fecha })
        .populate({
            path: 'pedido',
            select: '-_id -status -__v',
            populate: [
                {
                    path: 'fotografo',
                    select: '-pedidosTomados -asistencia -ocupado -activo -contrasena -__v -email -telefono -rol -rol_sec'
                },
                {
                    path: 'productos',
                    select: '-_id -familia -__v -activo'
                },
                {
                    path: 'cliente',
                    select: '-pedidos -activo -contrasena -direccion -colonia -municipio -estado -cp -num_ext -num_int -__v -razonSocial -rfc'
                }
            ]
        })
        .exec((err: NativeError, ventas: IVenta[]) => {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudieron obtener los pedidos' });
            var pedidos = [];
            for (let i = 0; i < ventas.length; i++) {
                pedidos[i] = ventas[i].pedido;
            }
            return res.json(pedidos);
        })
}
function pedidosVendidos(res: Response) {
    Venta.find()
        .populate({
            path: 'pedido',
            select: '-_id -status -__v',
            populate: [
                {
                    path: 'cliente',
                    select: '-pedidos -activo -contrasena -direccion -colonia -municipio -estado -cp -num_ext -num_int -__v -razonSocial -rfc'
                },
                {
                    path: 'fotografo',
                    select: '-pedidosTomados -asistencia -ocupado -activo -contrasena -__v -email -telefono -rol -rol_sec'
                },
                {
                    path: 'productos',
                    select: '-_id -familia -__v -activo'
                }
            ]
        })
        .exec((err: NativeError, ventas: IVenta[]) => {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudieron obtener los pedidos' });
            var pedidos = [];
            for (let i = 0; i < ventas.length; i++) {
                pedidos[i] = ventas[i].pedido;
            }
            return res.json(pedidos);
        })
}
function pedidosVendidosPorEmpleadoDia(fecha: Date, res: Response, id: string) {
    Venta.aggregate()
        .lookup({
            from: "pedidos",
            localField: "pedido",
            foreignField: "_id",
            as: "pedido",
        })
        .unwind('pedido')
        .unwind('pedido.fotografo')
        .lookup({
            from: "usuarios",
            localField: "pedido.fotografo",
            foreignField: "_id",
            as: "pedido.fotografo",
        })
        .unwind('pedido.fotografo')
        .lookup({
            from: "productos",
            localField: "pedido.productos",
            foreignField: "_id",
            as: "pedido.productos",
        })
        .match({
            fecha,
            'pedido.fotografo._id': Types.ObjectId(id)
        })
        .exec((err: NativeError, ventas: any[]) => {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudieron obtener los pedidos' });
            let pedidos = [];
            for (let i = 0; i < ventas.length; i++) {
                pedidos[i] = ventas[i].pedido;
            }
            return res.json(pedidos);
        });
}
function pedidosVendidosPorEmpleado(res: Response, id: string) {
    Venta.aggregate()
        .lookup({
            from: "pedidos",
            localField: "pedido",
            foreignField: "_id",
            as: "pedido",
        })
        .unwind('pedido')
        .unwind('pedido.fotografo')
        .lookup({
            from: "usuarios",
            localField: "pedido.fotografo",
            foreignField: "_id",
            as: "pedido.fotografo",
        })
        .unwind('pedido.fotografo')
        .lookup({
            from: "productos",
            localField: "pedido.productos",
            foreignField: "_id",
            as: "pedido.productos",
        })
        .match({
            'pedido.fotografo._id': Types.ObjectId(id)
        })
        .exec((err: NativeError, ventas: any[]) => {
            if (err) return res.status(422).send({ titulo: 'Error', detalles: 'No se pudieron obtener los pedidos' });
            let pedidos = [];
            for (let i = 0; i < ventas.length; i++) {
                pedidos[i] = ventas[i].pedido;
            }
            return res.json(pedidos);
        });
}
function generarCodigo(): string {
    const tamCodigo = 8;
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let codigo = '';
    for (let i = 0; i < tamCodigo; i++) {
        codigo += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    return codigo;
}
/* Funciones para sockets */
function obtenerNuevoElementoAdminOSupervisor(elemento: any, res: Response, tipo: number) {
    const servidor = Servidor.instance;
    for (let usuarioConectado of Socket.usuariosConectados.lista) {//
        if (usuarioConectado !== undefined && usuarioConectado._id != res.locals.usuario._id && ((usuarioConectado.rol == 2 && usuarioConectado.rol_sec == 0) || (usuarioConectado.rol == 1 && usuarioConectado.rol_sec == 0))) {
            switch (tipo) {
                case 0: servidor.io.in(usuarioConectado.id).emit('nuevo-proveedor', elemento); break;
                case 1: servidor.io.in(usuarioConectado.id).emit('nueva-familia-eliminada', elemento); break;
                case 2: servidor.io.in(usuarioConectado.id).emit('nueva-familia', elemento); break;
            }
        }
    }
}