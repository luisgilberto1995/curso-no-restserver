
const { Schema, model } = require('mongoose');

const ProductoSchema = Schema({
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
    },
    precio: {
        type: Number,
        default: 0
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required: [true, 'LA CATEGORIA ES OBLIGATORIA']
    },
    descripcion: {
        type: String,
    },
    disponible: {
        type: Boolean,
        default: true
    }
});

module.exports = model('Producto', ProductoSchema);