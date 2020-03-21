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
const RootCtrl = __importStar(require("../controladores/root"));
const rutasRoot = express_1.Router();
rutasRoot.get('/usuarios-sucursal', UsuarioCtrl.autenticacionMiddleware, RootCtrl.rootMiddleware, RootCtrl.obtenerUsuariosSinSucursal);
rutasRoot.get('/sucursales', UsuarioCtrl.autenticacionMiddleware, RootCtrl.rootMiddleware, RootCtrl.obtenerSucursales);
rutasRoot.post('/sucursal', UsuarioCtrl.autenticacionMiddleware, RootCtrl.rootMiddleware, RootCtrl.nuevaSucursal);
rutasRoot.patch('/usuarios', UsuarioCtrl.autenticacionMiddleware, RootCtrl.rootMiddleware, RootCtrl.asignarSucursalUsuario);
exports.default = rutasRoot;
