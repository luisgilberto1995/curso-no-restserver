const { Router, request, response } = require('express');
const { check } = require('express-validator');
const { login, googleSignin } = require('../controllers/auth');
const { crearProducto, getProductos, getProductoPorId, actualizarProducto, eliminarProducto } = require('../controllers/productos');
const { existeCategoriaId, noExisteCategoriaId, existeProductoId } = require('../helpers/db-validators');
const { validarJWT, esAdminRole } = require('../middlewares');
const { validarCampos } = require('../middlewares/validar-campos');


const router = Router();

// OBTENER TODOS LOS PRODUCTOS
router
    .get(
        '/',
        [],
        getProductos);

// OBTENER PRODUCTO POR ID
router
    .get(
        '/:id',
        [
            check('id', 'No es un ID valido').isMongoId(),
            check('id').custom(existeProductoId),
            validarCampos
        ],
        getProductoPorId);

// CREAR PRODUCTO
router.post('/',
    [
        validarJWT,
        check('nombre', 'EL NOMBRE ES OBLIGATORIO').not().isEmpty(),
        check('categoria', 'EL categoria ES OBLIGATORIO').not().isEmpty(),
        check('categoria', 'No es un ID valido').isMongoId(),
        check('categoria').custom(existeCategoriaId),
        validarCampos
    ],
    crearProducto);

// ACTUALIZAR PRODUCTO
router.put('/:id',
    [
        validarJWT,
        check('id', 'No es un ID valido').isMongoId(),
        check('id').custom(existeProductoId),
        
        validarCampos
    ],
    actualizarProducto);

// ELIMINAR PRODUCTO
router.delete('/:id',
    [
        validarJWT,
        esAdminRole,
        check('id', 'No es un ID valido').isMongoId(),
        check('id').custom(existeProductoId),
        validarCampos
    ],
    eliminarProducto);

module.exports = router;