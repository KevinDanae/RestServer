const { Router } = require('express');
const { check } = require('express-validator');
const { login, googleSign } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar');

const router = Router();

router.post('/login',[
    check('email', 'El correo es obligatorio').isEmail(),
    check('password', 'el password es obligatorio').not().isEmpty(),
    validarCampos
], login );

router.post('/google',[
    check('id_token', 'El id token es necesario').not().isEmpty(),
    validarCampos
], googleSign );


module.exports = router;