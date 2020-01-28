const express = require('express'),
      ruta = express.Router(),
      Producto = require('../controladores/producto');
     
ruta.get('/obtenerProductos/:id', Producto.obtenerProductos);
ruta.get('/obtenerProductosPorCantidad/:nombre', Producto.obtenerProductosPorCantidad);
ruta.get('/obtenerProductosPorTam/:nombre', Producto.obtenerProductosPorTam);
ruta.get('/familias', Producto.obtenerFamilias );
ruta.get('/buscarProductoPorTam/:ancho/:alto', Producto.buscarProductoPorTam)
ruta.get('/obtenerFamiliasYProductos', Producto.obtenerFamiliasYProductos)
//post
ruta.post('/buscarProducto', Producto.buscarProducto)


module.exports = ruta;