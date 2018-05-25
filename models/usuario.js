const mongoose = require('mongoose');
const config = require('../config/database');


//Schema de usuario

const UsuarioSchema = mongoose.Schema ({
    tipo: String,
    email: String,
    nombre: String,
    apellido: String,
    panoramas: String
   
});

const Usuario = module.exports = mongoose.model('Usuario', UsuarioSchema);