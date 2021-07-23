const { response } = require('express');
const { ObjectId } = require('mongoose').Types;
const {
    Categoria,
    Role,
    Server,
    Usuario,
    Producto } = require('../models')

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles'

];

const buscarUsuarios = async (termino = '', res = response) => {
    const esMongoID = ObjectId.isValid(termino);
    if (esMongoID) {
        const usuario = await Usuario.findById(termino);
        console.log(usuario)
        return res.json({
            results: (usuario) ? [usuario] : []
        });
    }
    const regex = new RegExp( termino, 'i');
    const usuarios = await Usuario.find({ 
        $or:[{nombre: regex, estado:true}, {correo:regex} ],
        $and: [{ estado:true   }]

    });
    
    return res.json({
        results: (usuarios) ? [usuarios] : []
    });
}

const buscarProductos = async (termino = '', res = response) => {
    const esMongoID = ObjectId.isValid(termino);
    if (esMongoID) {
        const producto = await Producto.findById(termino);
        console.log(producto)
        return res.json({
            results: (producto) ? [producto] : []
        });
    }
    const regex = new RegExp( termino, 'i');
    const productos = await Producto.find({ estado:true, nombre:regex });
    
    return res.json({
        results: productos
    });
}

const buscarCategorias = async (termino = '', res = response) => {
    const esMongoID = ObjectId.isValid(termino);
    if (esMongoID) {
        const categoria = await Categoria.findById(termino);
        console.log(categoria);
        return res.json({
            results: (categoria) ? [categoria] : []
        });
    }
    const regex = new RegExp( termino, 'i');
    const categorias = await Categoria.find( { nombre: regex, estado:true } );
    
    return res.json({
        results: categorias
    });
}

const buscar = (req, res = response) => {

    const { coleccion, termino } = req.params;

    if (!coleccionesPermitidas.includes(coleccion)) {
        return res.status(400).json({
            msg: `La coleccion ${coleccion} no se encontro`
        })
    }

    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino, res);
            break;
        case 'categorias':
            buscarCategorias(termino, res);
            break;
        case 'productos':
            buscarProductos(termino, res);
            break;
        case 'roles':

            break;

        default:
            res.status(500).json({
                msg: 'no se encontro esa coleccion definida en el servidor'
            })
            break;
    }
}


module.exports = {
    buscar
}