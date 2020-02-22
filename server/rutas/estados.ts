import { Router } from 'express';
import * as EstadosCtrl from '../controladores/estados';

const rutasEstados = Router();

rutasEstados.get('/estados', EstadosCtrl.obtenerEstados);
rutasEstados.get('/municipios/:id', EstadosCtrl.obtenerMunicipios);

export default rutasEstados;