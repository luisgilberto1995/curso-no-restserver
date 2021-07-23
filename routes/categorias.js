const { Router, request, response } = require('express');
const { check } = require('express-validator');
const { login, googleSignin } = require('../controllers/auth');
const { crearCategoria, getCategorias, getCategoriaPorId, actualizarCategoria, eliminarCategoria } = require('../controllers/categorias');
const { existeCategoriaId, noExisteCategoriaId } = require('../helpers/db-validators');
const { validarJWT, esAdminRole } = require('../middlewares');
const { validarCampos } = require('../middlewares/validar-campos');


const router = Router();
/*
Obtener todas las categorias
    - publico
    - get
    - paginado
    - total
    - populate(Mongoose)
Obtener una categoria por id
    - publico 
    - get
    - populate(Mongoose)
Actualizar por id 
    - privado 
    - put
    - cualquier persona con token 
    - actualizar nombre
Borrar categoria 
    - privado 
    - delete
    - solo si es admin 
    - cambiar estado a false
CREAR MIDDLEWARE PERSONALIZADO!!!! (existeCategoria(id): dbvalidators)

 */
router
    .get(
        '/',
        [],
        getCategorias);

router.get('/:id',
    [
        check('id', 'No es un ID valido').isMongoId(),
        check('id').custom(existeCategoriaId),
        validarCampos
    ],
    getCategoriaPorId);

router.post('/',
    [
        validarJWT,
        check('nombre', 'EL NOMBRE ES OBLIGATORIO').not().isEmpty(),
        validarCampos
    ],
    crearCategoria);

router.put('/:id',
    [
        validarJWT,
        check('id', 'No es un ID valido').isMongoId(),
        check('id').custom(existeCategoriaId),
        check('nombre', 'EL NOMBRE ES OBLIGATORIO').not().isEmpty(),
        validarCampos
    ],
    actualizarCategoria);

router.delete('/:id',
    [
        validarJWT,
        esAdminRole,
        check('id', 'No es un ID valido').isMongoId(),
        check('id').custom(existeCategoriaId),
        validarCampos
    ],
    eliminarCategoria);

module.exports = router;