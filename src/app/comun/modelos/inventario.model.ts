import { Usuario } from './usuario.model';
import { ProductoProveedor } from './producto_proveedor.model';
import { Almacen } from './almacen.model';

export class InsumoInventario {
    insumo: ProductoProveedor;
    existenciaEsperada: number;
    existenciaReal: number;
    observaciones?: string;
    revisado: boolean;
}

export class Inventario {
    _id?: string;
    id?: number;
    fechaRegistro?: Date;
    usuario: Usuario | string;
    almacen: Almacen | string;
    insumos: InsumoInventario[] = [];

    constructor() { }
}