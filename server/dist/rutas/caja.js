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
const middlewares_1 = require("../middlewares/middlewares");
const CajaCtrl = __importStar(require("../controladores/caja"));
const rutasCaja = express_1.Router();
//get
rutasCaja.get('/existe-corte/:id', middlewares_1.autenticacionMiddleware, middlewares_1.adminOSupervisorMiddleware, CajaCtrl.existeCorteCaja);
rutasCaja.get('/cortes-caja/:id', middlewares_1.autenticacionMiddleware, middlewares_1.adminOSupervisorMiddleware, CajaCtrl.obtenerCortesCaja);
rutasCaja.get('/eliminadas', middlewares_1.autenticacionMiddleware, middlewares_1.adminOSupervisorMiddleware, CajaCtrl.obtenerCajasEliminadas);
rutasCaja.get('/desocupadas', middlewares_1.autenticacionMiddleware, middlewares_1.adminOSupervisorORecepcionistaMiddleware, CajaCtrl.obtenerCajasDesocupadas);
rutasCaja.get('/:id', middlewares_1.autenticacionMiddleware, middlewares_1.adminOSupervisorMiddleware, CajaCtrl.obtenerCaja);
rutasCaja.get('', middlewares_1.autenticacionMiddleware, middlewares_1.adminOSupervisorORecepcionistaMiddleware, CajaCtrl.obtenerCajas);
//post
rutasCaja.post('/corte-caja', middlewares_1.autenticacionMiddleware, middlewares_1.adminOSupervisorMiddleware, CajaCtrl.crearCorteCaja);
rutasCaja.post('', middlewares_1.autenticacionMiddleware, middlewares_1.adminOSupervisorMiddleware, CajaCtrl.agregarCaja);
//patch
rutasCaja.patch('/abrir/:id', middlewares_1.autenticacionMiddleware, middlewares_1.adminOSupervisorORecepcionistaMiddleware, CajaCtrl.abrirCaja);
rutasCaja.patch('/restaurar', middlewares_1.autenticacionMiddleware, middlewares_1.adminOSupervisorMiddleware, CajaCtrl.restaurarCaja);
rutasCaja.patch('/completa', middlewares_1.autenticacionMiddleware, middlewares_1.adminOSupervisorMiddleware, CajaCtrl.actualizarCajaCompleta);
rutasCaja.patch('/:id', middlewares_1.autenticacionMiddleware, middlewares_1.adminOSupervisorORecepcionistaMiddleware, CajaCtrl.actualizarCaja);
rutasCaja.patch('', middlewares_1.autenticacionMiddleware, middlewares_1.adminOSupervisorMiddleware, CajaCtrl.eliminarCaja);
exports.default = rutasCaja;
