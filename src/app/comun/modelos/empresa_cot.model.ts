export class EmpresaCot {
    _id: string
    nombre: string;
    direccion: string;
    contacto: string;
    telefono: number;
    email: string;
    activa: number;
    constructor() { }

    nuevaEmpresa(_id: string, nombre: string, direccion: string, contacto: string, telefono: number, email: string, activa: number) {
        let nuevaEmpresa = new EmpresaCot();
        nuevaEmpresa._id = _id;
        nuevaEmpresa.nombre = nombre;
        nuevaEmpresa.direccion = direccion;
        nuevaEmpresa.contacto = contacto;
        nuevaEmpresa.telefono = telefono;
        nuevaEmpresa.email = email;
        nuevaEmpresa.activa = activa;
        return nuevaEmpresa;
    }
}