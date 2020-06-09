import { Router } from 'express';
import multer from 'multer';
import { autenticacionMiddleware, rootMiddleware } from '../middlewares/middlewares';
import * as EmpresaCtrl from '../controladores/empresa';

const storage = multer.diskStorage({
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    },
    destination: function (req, file, cb) {
        cb(null, './subidas/logotipos');
    }
}),
    upload = multer({ storage: storage });
const rutasEmpresa = Router();

//GET
rutasEmpresa.get('/datos-generales', autenticacionMiddleware, rootMiddleware, EmpresaCtrl.obtenerDatosGeneralesEmpresa);
rutasEmpresa.get('/logotipo', autenticacionMiddleware, EmpresaCtrl.obtenerLogotipoEmpresa);

//POST
//PUT
//PATCH
rutasEmpresa.patch('/logotipo', autenticacionMiddleware, upload.single('imagen'), EmpresaCtrl.cambiarLogotipo);

export default rutasEmpresa;