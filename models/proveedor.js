const mongoose = require('mongoose');
const config = require('../config/database');


//Schema de proveedor

const ProveedorSchema = mongoose.Schema ({
    tipo: String,
    email: String,
    nombreEmpresa: String,
    nombreContacto: String,
    numeroContacto: String,
    descripcionEmpresa: String
   
});

const Proveedor = module.exports = mongoose.model('Proveedor', ProveedorSchema);