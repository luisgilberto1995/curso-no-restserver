const { response, request } = require("express");
const { Categoria } = require('../models')

const crearCategoria = async (req, res = response)=>{
    const nombre  = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne( { nombre } );
    if ( categoriaDB ) {
        res.status(400).json({
            msg:`La categoria ${ categoriaDB.nombre} ya existe`
        });
    }

    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria = new Categoria( data );
    await categoria.save();
    res.json(categoria);
}

const getCategorias = async (req = request, res = response)=>{
    const { limite = 5, desde = 0 } = req.body;

    const [total, categorias] = await Promise.all([
        Categoria.countDocuments({ estado: true }),
        Categoria.find({ estado: true })
        .populate('usuario')
        .skip(Number(desde))
        .limit(Number(limite))
    ]);

    res.json({
        total, 
        categorias
    });
}

const getCategoriaPorId = async (req = request, res = response) => {
    const { id } = req.params;
    const categoria = await Categoria.findById( id ).populate('usuario');
    console.log('id: ', id, " categoria:", categoria)
    if (!categoria) {
        res.status(400).json({
            msg:'La categoria enviada no existe'
        });
        return;
    }
    if (!categoria.estado) {
        res.status(400).json({
            msg:'La categoria enviada no existe'
        });
        return;
    }
    res.json(categoria);
}

const actualizarCategoria = async ( req = request, res = response ) => {

    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    data.nombre  = req.body.nombre.toUpperCase();
    data.usuario = req.usuario._id; 

    const categoriaPreexistente = await Categoria.findById(id);
    if (categoriaPreexistente.nombre === data.nombre) {
        res.status(400).json({
            msg:'El nombre de la categoria que desea actualizar YA EXISTE'
        });
        return;
    }
    const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true });

    res.json(categoria);
}

const eliminarCategoria = async ( req = request, res = response ) => {

    const { id } = req.params;

    const categoria = await Categoria.findByIdAndUpdate(id, { estado: false}, { new: true });
    
    res.json(categoria);
}

module.exports = {
    crearCategoria,
    getCategorias,
    getCategoriaPorId,
    actualizarCategoria,
    eliminarCategoria
}