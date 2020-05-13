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
const CotizacionesCtrl = __importStar(require("../controladores/cotizaciones"));
const rutasCotizaciones = express_1.Router();
/* GET */
rutasCotizaciones.get('/empresas', middlewares_1.autenticacionMiddleware, middlewares_1.adminOSupervisorMiddleware, CotizacionesCtrl.obtenerEmpresas);
rutasCotizaciones.get('', middlewares_1.autenticacionMiddleware, middlewares_1.adminOSupervisorMiddleware, CotizacionesCtrl.obtenerCotizaciones);
/* POST */
rutasCotizaciones.post('/empresas', middlewares_1.autenticacionMiddleware, middlewares_1.adminOSupervisorMiddleware, CotizacionesCtrl.nuevaEmpresa);
rutasCotizaciones.post('', middlewares_1.autenticacionMiddleware, middlewares_1.adminOSupervisorMiddleware, CotizacionesCtrl.nuevaCotizacion);
/* PUT */
rutasCotizaciones.put('/empresa', middlewares_1.autenticacionMiddleware, middlewares_1.adminOSupervisorMiddleware, CotizacionesCtrl.editarEmpresa);
/* PATCH */
rutasCotizaciones.patch('/empresa', middlewares_1.autenticacionMiddleware, middlewares_1.adminOSupervisorMiddleware, CotizacionesCtrl.eliminarEmpresa);
exports.default = rutasCotizaciones;
