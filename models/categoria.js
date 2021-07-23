
const { Schema, model } = require('mongoose');

const CategoriaSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'EL NOMBRE ES OBLIGATORIO'],
        unique: true
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'EL USUARIO ES OBLIGATORIO']
    }
});

module.exports = model('Categoria', CategoriaSchema);