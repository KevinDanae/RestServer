const { response } = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/JWT');

const login = async (req, res = response) => {

    const { email, password } = req.body; 

    try {   

        // verificar si el email existe
        const usuario = await Usuario.findOne({ email });
        if ( !usuario ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos'
            });
        }
        // el usuario esta activo
        if( !usuario.status ) {
            return res.status(400).json({
                msg: 'El correo ingresado esta dado de baja'
            })
        }
        // verificar la contrasena
        const validPass = bcrypt.compareSync( password, usuario.password );
        if ( !validPass ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos'
            });
        }
        // generar el JWT
        const token = await generarJWT( usuario.id );

        res.json({
            usuario,
            token
        });

    } catch (err) {
        console.log(err);
        res.json({
            msg: "Algo salio mal"
        });
    }
}

module.exports = {
    login,
}