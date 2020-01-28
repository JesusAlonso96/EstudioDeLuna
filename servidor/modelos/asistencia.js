const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const asistenciaSchema = new Schema({
    fecha: {type: Date},
    asistencia: Boolean
});



module.exports = mongoose.model('Asistencia', asistenciaSchema);