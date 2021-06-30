const { Router } = require('express');
const { check } = require('express-validator');
const { usuariosGet,
    usuariosPost,
    usuariosPatch,
    usuariosDelete,
    usuariosPut } = require('../controllers/user');
const { esRoleValido, esCorreoValido, existeUsuarioId } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();


router.get('/', usuariosGet);

router.post('/', [
    check('correo', 'El correo no cumple con el patrón requerido').isEmail(),
    check('correo').custom(esCorreoValido),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe ser mas de 6 letras').isLength({ min: 6 }),
    check('rol').custom(esRoleValido),
    validarCampos
], usuariosPost);

router.put('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeUsuarioId),
    validarCampos
], usuariosPut);

router.patch('/', usuariosPatch);

router.delete('/:id',
    [
        check('id', 'No es un ID valido').isMongoId(),
        check('id').custom(existeUsuarioId),
        validarCampos
    ],
    usuariosDelete);





module.exports = router;