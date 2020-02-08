import { Usuario } from './usuario.model';
import { EmpresaCot } from './empresa_cot.model';
import { DatosEstudio } from './datos_estudio.model';
import { ProductoCot } from './producto_cot.model';

export class Cotizacion {
    _id: string;
    num_cotizacion: number;
    fecha: Date;
    vigencia: number;
    asesor: Usuario;
    empresa: EmpresaCot;
    datos: DatosEstudio;
    productos: ProductoCot[];
    subtotal: number;
    total: number;
    iva: number;
    forma_pago: string;
    fecha_entrega: Date;
    fecha_evento: Date;
    constructor() { 
        this.productos = [];
        this.subtotal = 0;
        this.total = 0;
        this.iva = 0;
        this.datos = new DatosEstudio();
    }
}