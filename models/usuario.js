

// Usuario: {
//     nombre,
//     correo,
//     password,
//     img,
//     rol,
//     estado: false,
//     google: true
// }

const { Schema, model } = require('mongoose');

const UsuarioShema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'La contrasenia es obligatorio']
    },
    img: {
        type: String
    },
    rol: {
        type: String,
        required: [true, 'El rol es obligatorio']
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        required: false,
        default: false
    }

});


UsuarioShema.methods.toJSON = function(){
    const { __v, password, _id, ...usuario} = this.toObject();
    usuario.uid = _id;
    return usuario;
}


module.exports = model( 'Usuario', UsuarioShema );