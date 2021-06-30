
const { Schema, model } = require('mongoose');

const RolSchema = Schema({
    rol:{
        type:String,
        required: [true, 'EL ROL ES OBLIGATORIO']
    }
});

module.exports = model('Role', RolSchema );