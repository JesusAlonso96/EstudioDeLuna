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
const ClienteCtrl = __importStar(require("../controladores/cliente"));
const rutasCliente = express_1.Router();
//get
rutasCliente.get('', middlewares_1.autenticacionMiddleware, ClienteCtrl.obtenerClientes);
rutasCliente.get('/obtenerDatosClientes', middlewares_1.autenticacionMiddleware, ClienteCtrl.obtenerDatosClientes);
rutasCliente.get('/obtenerClientePorEmailNombre/:nombre/:email', ClienteCtrl.obtenerClienteNombreEmail);
rutasCliente.get('/obtenerPedidosCliente/:id', ClienteCtrl.obtenerPedidosCliente);
rutasCliente.get('/obtenerClientesEliminados', middlewares_1.autenticacionMiddleware, middlewares_1.adminOSupervisorMiddleware, ClienteCtrl.obtenerClientesEliminados);
//post
rutasCliente.post('/registrar', middlewares_1.autenticacionMiddleware, middlewares_1.adminOSupervisorORecepcionistaMiddleware, ClienteCtrl.registrarCliente);
//patch
rutasCliente.patch('/eliminarCliente', middlewares_1.autenticacionMiddleware, middlewares_1.adminOSupervisorMiddleware, ClienteCtrl.eliminarCliente);
rutasCliente.patch('/actualizarCliente', middlewares_1.autenticacionMiddleware, middlewares_1.adminOSupervisorMiddleware, ClienteCtrl.editarCliente);
rutasCliente.patch('/restaurarCliente', middlewares_1.autenticacionMiddleware, middlewares_1.adminOSupervisorMiddleware, ClienteCtrl.restaurarClienteEliminado);
exports.default = rutasCliente;
