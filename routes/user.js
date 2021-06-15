const { Router } = require('express');
const { check } = require('express-validator');

const { usuariosGet, 
    usuariosPut, 
    usuariosPost, 
    usuariosDelete, 
    usuariosPatch } 
= require('../controllers/user');
const { roleValido, emailExiste, existeUsuario } = require('../helpers/db-validators');

const { validarCampos } = require('../middlewares/validar');


const router = Router();

router.get('/', usuariosGet);

router.put('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom( existeUsuario ),
    check('rol').custom( roleValido ),
    validarCampos
], usuariosPut );

router.post('/', [
    check('email', 'El correo no es valido').isEmail(),
    check('email').custom( emailExiste ),
    check('password', 'El password es obligatorio y debe tener minimo 6 caracteres').isLength({ min: 6}),
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    //check('rol', 'No es un rol valido o permitido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('rol').custom( roleValido ),
    validarCampos
], usuariosPost );

router.delete('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom( existeUsuario ),
    validarCampos
], usuariosDelete );

router.patch('/', usuariosPatch );

module.exports = router;