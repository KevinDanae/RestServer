const { response } = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/JWT');
const { googleVerify } = require('../helpers/google-verify');

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

const googleSign = async (req,res) => {

    const { id_token } = req.body;


    try {

        
        const { email, name, img } = await googleVerify( id_token );

        let usuario = await Usuario.findOne({ email });

        if ( !usuario ) {
            // tenemos que crearlo 
            const data = {
                name,
                email,
                password: ':P',
                img,
                rol: 'USER_ROLE',
                google: true
            };

            usuario = new Usuario( data );
            await usuario.save();
        }

        // Si el usuario en DB
        if ( !usuario.status ) {
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            });
        }

        // generar el JWT
        const token = await generarJWT( usuario.id );

        res.json({
            msg: 'Todo ok con google',
            token, 
            usuario
        });

    } catch (error) {
        console.log(error)
        res.status(400).json({
            msg: 'Token de Google no es valido'
        });
    }
    
    

}

module.exports = {
    login,
    googleSign
}