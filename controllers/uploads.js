const path = require('path');
const fs = require('fs');
const { request, response } = require("express");
const { subirArchivo } = require("../helpers");
const { Usuario, Producto } = require('../models');
const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const cargarArchivo = async (req = request, res = response) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        res.status(400).json({ msg: 'No files were uploaded 1.' });
        return;
    }
    if (!req.files.archivo) {
        res.status(400).json({ msg: 'No files were uploaded.' });
        return;
    }

    try {
        const path = await subirArchivo(req.files, ['txt', 'md'], 'textos');
        res.json({
            path
        });
    } catch (error) {
        res.status(400).json({ msg: error });
    }

}

const actualizarImagen = async (req, res = response) => {
    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: 'no existe el usuario con el id ' + id
                })
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: 'no existe el producto con el id ' + id
                })
            }
            break;
        default:
            return res.status(500).json({ msg: 'Error del servidor, sorry' })
    }

    if ( modelo.img ) {
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img );
        if ( fs.existsSync(pathImagen)) {
            fs.unlinkSync(pathImagen);
        }
    }

    try {
        const nombre = await subirArchivo(req.files, ['png', 'jpg', 'jpeg'], coleccion);
        modelo.img = nombre;
        await modelo.save();
        res.json(modelo)
    } catch (error) {
        console.log("Error: ", error);
        res.status(500).json({
            error: error
        })
    }
}

const actualizarImagenCloudinary = async (req, res = response) => {
    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: 'no existe el usuario con el id ' + id
                })
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: 'no existe el producto con el id ' + id
                })
            }
            break;
        default:
            return res.status(500).json({ msg: 'Error del servidor, sorry' })
    }

    if ( modelo.img ) {
        const nombreArr = modelo.img.split('/');
        const nombre = nombreArr[nombreArr.length - 1];
        const [ public_id, ] = nombre.split('.');
        await cloudinary.uploader.destroy ( public_id );
        console.log(public_id)
    }

    const { tempFilePath } = req.files.archivo;
    const { secure_url } = await cloudinary.uploader.upload( tempFilePath );
    modelo.img = secure_url;
    await modelo.save();
    res.json( { secure_url } );
}

const mostrarImagen = async (req, res = response) => {
    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: 'no existe el usuario con el id ' + id
                })
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: 'no existe el producto con el id ' + id
                })
            }
            break;
        default:
            return res.status(500).json({ msg: 'Error del servidor, sorry' })
    }

    if ( modelo.img ) {
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img );
        if ( fs.existsSync(pathImagen)) {
            res.sendFile(pathImagen);
            return;
        }
    }

    const pathPlaceHolder = path.join(__dirname, '../assets/no-image.jpg');
    res.sendFile(pathPlaceHolder);

}

module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary
}