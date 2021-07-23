const { request, response } = require("express")

const esAdminRole = (req = request, res = response, next) => {

    if (!req.usuario) {
        return res.status(500).json({
            msg: 'Se quiere verificar el rol sin validar primero el token'
        });
    }

    const { rol, nombre } = req.usuario;
    if (rol !== 'ADMIN_ROL') {
        return res.status(401).json({
            msg: `${nombre} no es administrador - Rol incorrecto`
        });
    }

    next();
}

const tieneRole = (...roles) => {
    return (req, res = response, next) => {
        if (!req.usuario) {
            return res.status(500).json({
                msg: 'Se quiere verificar el rol sin validar primero el token'
            });
        }
        if ( !roles.includes(req.usuario.rol)) {
            return res.status(401).json({
                msg: 'El servicio requiere uno de estos roles('+req.usuario.rol+'): '+roles.toString() 
            });
        }
        next();
    }
}

module.exports = {
    esAdminRole,
    tieneRole
}