import { Router } from 'express';
import multer from 'multer';
import * as EmpleadoCtrl from '../controladores/empleado';
import { autenticacionMiddleware, adminOSupervisorORecepcionistaMiddleware } from '../middlewares/middlewares';
const storage = multer.diskStorage({
    filename: (req, file, cb) => {
        cb(null, file.originalname + '.jpeg')
    },
    destination: function (req, file, cb) {
        cb(null, './subidas');
    }
}),
    upload = multer({ storage: storage }); 
const rutasEmpleado = Router();

//get
rutasEmpleado.get('/fotografo/:id', autenticacionMiddleware, EmpleadoCtrl.obtenerFotografo)
rutasEmpleado.get('/fotografos', autenticacionMiddleware, EmpleadoCtrl.obtenerFotografos)
rutasEmpleado.get('/asignarFotografo/:fecha', autenticacionMiddleware, EmpleadoCtrl.asignarFotografo);
rutasEmpleado.get('/asistioTrabajador/:id/:fecha', EmpleadoCtrl.tieneAsistenciaTrabajador);
rutasEmpleado.get('/obtenerNotificaciones/:id/:fecha', EmpleadoCtrl.obtenerNotificaciones);


//post
rutasEmpleado.post('/crearVenta/:cantidadACaja/:metodoPago/:id', autenticacionMiddleware, adminOSupervisorORecepcionistaMiddleware, EmpleadoCtrl.realizarVenta);

//patch
rutasEmpleado.patch('/crearImagen/:id', upload.single('imagen'), EmpleadoCtrl.crearFoto);

rutasEmpleado.patch('/actualizarOcupado/:id', EmpleadoCtrl.actualizarOcupado);
rutasEmpleado.patch('/actualizarCaja/:cantidadACaja/:metodoPago/:id', EmpleadoCtrl.actualizarCaja);

//delete
rutasEmpleado.delete('/eliminarNotificacion/:id', EmpleadoCtrl.eliminarNotificacion);


export default rutasEmpleado;