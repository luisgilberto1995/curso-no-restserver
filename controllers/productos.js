const { response, request } = require("express");
const { Producto, Categoria } = require('../models')

const getProductos = async (req = request, res = response ) => {

    const { limite = 5, desde = 0 } = req.body;

    const [total, productos] = await Promise.all([
        Producto.countDocuments({ estado: true }),
        Producto.find({ estado: true })
        .populate('usuario')
        .populate('categoria')
        .skip(Number(desde))
        .limit(Number(limite))
    ]);

    res.json({
        total, 
        productos
    });

}

const getProductoPorId = async (req = request, res = response ) => {
    const { id } = req.params;
    const producto = await Producto
                            .findById( id )
                            .populate('usuario')
                            .populate('categoria');
    console.log('id: ', id, " producto:", producto)
    if (!producto) {
        res.status(400).json({
            msg:'El producto enviado no existe'
        });
        return;
    }
    if (!producto.estado) {
        res.status(400).json({
            msg:'El producto enviado no existe'
        });
        return;
    }
    res.json(producto);
}

const crearProducto = async (req, res = response)=>{
    const { nombre, estado, precio, categoria, descripcion, disponible }  = req.body;
    const usuario = req.usuario._id;

    const categoriaDB = await Categoria.findById(categoria);
    if ( !categoriaDB ) {
        res.status(400).json({
            msg:`La categoria ${ categoria } no existe`
        });
        return;
    }
    else if ( !categoriaDB.estado ) {
        res.status(400).json({
            msg:`La categoria ${ categoria } no existe`
        });
        return;
    }
    const productoDB = await Producto.findOne( { nombre: nombre.toUpperCase() } );
    if ( productoDB ) {
        res.status(400).json({
            msg:`El producto ${ productoDB.nombre} ya existe`
        });
        return;
    }

    const data = {
        nombre: nombre.toUpperCase(),
        estado, 
        usuario,
        precio,
        categoria,
        descripcion,
        disponible
    }

    const producto = new Producto( data );
    await producto.save();
    res.json(producto);
}

const actualizarProducto = async ( req = request, res = response ) => {

    const { id } = req.params;
    const { estado, usuario, categoria, ...data } = req.body;

    data.nombre  = req.body.nombre.toUpperCase();
    data.usuario = req.usuario._id; 

    const productoPreexistente = await Producto.findById(id);
    if (productoPreexistente.nombre === data.nombre) {
        res.status(400).json({
            msg:'El nombre del producto que desea actualizar YA EXISTE'
        });
        return;
    }
    const producto = await Producto.findByIdAndUpdate(id, data, { new: true });

    res.json(producto);
}

const eliminarProducto = async ( req = request, res = response ) => {

    const { id } = req.params;
    const producto = await Producto.findByIdAndUpdate(id, { estado: false}, { new: true });
    res.json(producto);
}


module.exports = {
    crearProducto,
    getProductos,
    getProductoPorId,
    actualizarProducto,
    eliminarProducto
}