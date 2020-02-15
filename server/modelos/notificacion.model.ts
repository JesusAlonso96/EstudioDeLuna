import mongoose, { Schema, Document } from 'mongoose';
import { IUsuario } from './usuario.model';


export interface INotificacion extends Document {
    titulo: string;
    mensaje: string;
    fecha: Date;
    num_pedido: number;
    fecha_pedido: Date;
    tipo_pedido: Number;
    usuario: IUsuario['_id']
}
const notificacionSchema = new Schema({
    nombre: { type: String, required: true },
    estado: { type: Schema.Types.ObjectId, ref: 'Estado' }
});
export const Notificacion = mongoose.model<INotificacion>('Notificacion', notificacionSchema);
