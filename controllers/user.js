const { response, request } = require('express');


const usuariosGet = (req = request, res = response) => {
    const params = req.query;
    res.json({
        msg: "get API - controlador",
        params
    });
}

const usuariosPost = (req, res) => {
    const body = req.body;
    res.json({
        msg: "post API - controlador",
        body
    });
}

const usuariosPut = (req, res) => {

    const id = req.params.id;

    res.status(400).json({
        msg: "put API - controlador",
        id
    });
}

const usuariosPatch = (req, res) => {
    res.json({
        msg: "patch API - controlador"
    });
}

const usuariosDelete = (req, res) => {
    res.json({
        msg: "delete API - controlador"
    });
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}