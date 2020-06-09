export class Direccion {
    calle: string;
    num_ext: string;
    num_int: string;
    colonia: string;
    estado: string;
    ciudad: string;
    cp: string;
    constructor() {

    }
}
export class Telefono {
    lada: string;
    numero: string;
}
export class DatosEmpresa {
    nombre: string;
    rutaLogo: string;
    horarioTrabajo: string;
    curp: string //no
    nombreContacto: string;//si
    correoContacto: string//si
    nombreContactoFacturacion: string;//no
    correoContactoFacturacion: string//no
    telefonoContactoFacturacion: Telefono =  new Telefono();
    telefonos: Telefono[] = [];
    direccion: Direccion = new Direccion();
    direccionFacturacion: Direccion = new Direccion();
    fechaRegistro: Date;
    activo: boolean;
    constructor() {

    }
}