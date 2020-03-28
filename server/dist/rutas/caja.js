"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UsuarioCtrl = __importStar(require("../controladores/usuario"));
const CajaCtrl = __importStar(require("../controladores/caja"));
const AdminCtrl = __importStar(require("../controladores/admin"));
const rutasCaja = express_1.Router();
//get
rutasCaja.get('/existe-corte/:id', UsuarioCtrl.autenticacionMiddleware, UsuarioCtrl.adminOSupervisorMiddleware, CajaCtrl.existeCorteCaja);
rutasCaja.get('/cortes-caja/:id', UsuarioCtrl.autenticacionMiddleware, UsuarioCtrl.adminOSupervisorMiddleware, CajaCtrl.obtenerCortesCaja);
rutasCaja.get('/eliminadas', UsuarioCtrl.autenticacionMiddleware, UsuarioCtrl.adminOSupervisorMiddleware, CajaCtrl.obtenerCajasEliminadas);
rutasCaja.get('/:id', UsuarioCtrl.autenticacionMiddleware, UsuarioCtrl.adminOSupervisorMiddleware, CajaCtrl.obtenerCaja);
rutasCaja.get('', UsuarioCtrl.autenticacionMiddleware, UsuarioCtrl.adminOSupervisorMiddleware, CajaCtrl.obtenerCajas);
//post
rutasCaja.post('/corte-caja', UsuarioCtrl.autenticacionMiddleware, UsuarioCtrl.adminOSupervisorMiddleware, CajaCtrl.crearCorteCaja);
rutasCaja.post('', UsuarioCtrl.autenticacionMiddleware, UsuarioCtrl.adminOSupervisorMiddleware, CajaCtrl.agregarCaja);
//patch
rutasCaja.patch('/restaurar', UsuarioCtrl.autenticacionMiddleware, UsuarioCtrl.adminOSupervisorMiddleware, CajaCtrl.restaurarCaja);
rutasCaja.patch('/:id', UsuarioCtrl.autenticacionMiddleware, AdminCtrl.adminMiddleware, CajaCtrl.actualizarCaja);
rutasCaja.patch('', UsuarioCtrl.autenticacionMiddleware, UsuarioCtrl.adminOSupervisorMiddleware, CajaCtrl.eliminarCaja);
exports.default = rutasCaja;
