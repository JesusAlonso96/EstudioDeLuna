import {Router, Request, Response} from 'express';


const ruta = Router();

ruta.get('/mensaje' ,(req: Request, res: Response)=>{
    res.json({
        ok:true,
        mensaje:'todo bien'
    });
});

export default ruta;