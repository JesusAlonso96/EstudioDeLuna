const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const municipioSchema = new Schema({
    nombre: { type: String, required: true },
    estado: {type: Schema.Types.ObjectId, ref: 'Estado'}
});


module.exports = mongoose.model('Municipio', municipioSchema);