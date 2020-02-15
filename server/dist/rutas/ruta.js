"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ruta = express_1.Router();
ruta.get('/mensaje', (req, res) => {
    res.json({
        ok: true,
        mensaje: 'todo bien'
    });
});
exports.default = ruta;
