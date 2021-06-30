const Role = require('../models/rol');
const Usuario = require('../models/usuario');


const esRoleValido = async (rol = '')=>{
    const existeRol = await Role.findOne( { rol } );
    if( !existeRol ){
        throw new Error(`El rol ${ rol } no está registrado en la BD`);
    }
}

const esCorreoValido = async ( correo = '' )=>{
    const existeEmail = await Usuario.findOne({ correo });
    if ( existeEmail ) {
        throw new Error(`El correo ${ correo } ya esta registrado`);
    }
}

const existeUsuarioId = async ( id )=>{
    const existeUsuario = await Usuario.findById(id);
    if ( !existeUsuario ) {
        throw new Error(`No existe el id: ${ id } `);
    }
}
module.exports = {
    esRoleValido,
    esCorreoValido,
    existeUsuarioId
}

