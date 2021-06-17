const { response } = require('express');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario')

const validarJWT = async (req, res = response , next) => {

    const token = req.header('x-token');
    if ( !token ) {
        return res.status(401).json({
            msg: 'No hay token en la peticion'
        });
    }

    try {

        const { uid } = jwt.verify( token, process.env.SECRET_KEY );

        // leer el usuario que corresponda al uid
        const usuario = await Usuario.findById( uid );

        //validar si el usuario existe
        if ( !usuario ) {
            return res.status(401).json({
                msg: 'Token no valido'
            });
        }
        // verificar si el uid tiene estdo en true
        if ( !usuario.status ) {
            return res.status(401).json({
                msg: 'Token no valido'
            });
        }

        req.usuario = usuario;
        next();

    } catch (error) {

        console.log(error);
        res.status(401).json({
            msg: 'Token no valido'
        });
    }

    
}

module.exports = {
    validarJWT
}