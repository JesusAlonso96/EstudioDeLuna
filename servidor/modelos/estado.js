const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const estadoSchema = new Schema({
    nombre: { type: String, required: true },
});


module.exports = mongoose.model('Estado', estadoSchema);