import { Almacen } from './almacen.model';
import { Usuario } from './usuario.model';
import { ProductoProveedor } from './producto_proveedor.model';

export class Traspaso {
    _id: string;
    id: number;
    almacenOrigen: Almacen;
    almacenDestino: Almacen;
    insumo: ProductoProveedor;
    usuario: Usuario;
    estado: string;
    cantidadMovimiento: number;
    observaciones: string;
    fechaRegistro: Date;
    activo: boolean;

}