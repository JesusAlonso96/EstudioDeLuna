
export class Proveedor {
    _id: string;
    nombre: string;
    rfc: string;
    email: string;
    ciudad: string;
    estado: string;
    telefono: number;
    direccion: string;
    colonia: string;
    cp: number;
    num_ext: number;
    num_int: number;
    activo: number;
    productos: any; //cambiar a modelo productosCompra

    nuevoProveedor(_id: string, nombre: string, rfc: string, email: string, ciudad: string, estado: string, telefono: number, direccion: string, colonia: string, cp: number, num_ext: number, num_int: number, activo: number, productos: any): Proveedor {
        let proveedorNuevo = new Proveedor();
        proveedorNuevo._id = _id;
        proveedorNuevo.nombre = nombre;
        proveedorNuevo.rfc = rfc;
        proveedorNuevo.email = email;
        proveedorNuevo.ciudad = ciudad;
        proveedorNuevo.estado = estado;
        proveedorNuevo.telefono = telefono;
        proveedorNuevo.direccion = direccion;
        proveedorNuevo.colonia = colonia;
        proveedorNuevo.cp = cp;
        proveedorNuevo.num_ext = num_ext;
        proveedorNuevo.num_int = num_int;
        proveedorNuevo.activo = activo;
        proveedorNuevo.productos = productos;
        return proveedorNuevo;
    }
    constructor() { }


}
