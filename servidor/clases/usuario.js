export default class Usuario{
    constructor(id) {
        this.id = id;
        this.nombre = 'sin-nombre';
        this.sala = 'sin-sala';
        this._id = '';
        this.rol = -1;
        this.rol_sec = -1;
    }
    reiniciarUsuario(id){
        this.id = id;
        this.nombre = 'sin-nombre';
        this.sala = 'sin-sala';
        this._id = '';
    }
}