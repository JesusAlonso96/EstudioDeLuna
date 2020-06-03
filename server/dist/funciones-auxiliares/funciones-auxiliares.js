"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function generarContrasena() {
    let contrasena = '';
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 14; i++) {
        contrasena += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    return contrasena;
}
exports.generarContrasena = generarContrasena;
