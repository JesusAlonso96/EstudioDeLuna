const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const pestanaSchema = new Schema({
    rol: {type:String,required:true},
    nombre: {type:String,required:true},
    ruta: {type:String,required:true},
    icono: {type:String,required:true},

});



module.exports = mongoose.model('Pestana', pestanaSchema);