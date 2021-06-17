const { response, request } = require('express');
const bcrypt  = require('bcryptjs');
const Usuario = require('../models/usuario');


const usuariosGet = async ( req , res ) => {

    const { limite = 5, desde = 0 } = req.query;
    const verdadero = { status: true }

    const [ total, usuarios ] = await Promise.all([
        Usuario.countDocuments( verdadero ),
        Usuario.find( verdadero )
            .skip( Number( desde ))
            .limit( Number( limite ) )
    ]);

    res.json({
        total,
        usuarios
    });
}

const usuariosPost = async ( req, res ) => {

    const { name, email, password, rol } = req.body;
    const usuario = new Usuario( { name, email, password, rol } );

    
    //encriptar la contrasena
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync( password, salt );

    //guardar en base de datos
    await usuario.save();

    res.json({
        msg: 'post API - desde el controlador',
        usuario
    });
}

const usuariosPut = async ( req, res ) => {
    
    const {id} = req.params;
    const { _id, password, google, email, ...resto } = req.body;

    //TODO validar contra base de datos
    if ( password ) {
        //encriptar la contrasena
        const salt = bcrypt.genSaltSync();
        resto.password = bcrypt.hashSync( password, salt );
    }

    const usuarioDB = await Usuario.findByIdAndUpdate( id, resto );


    res.json(usuarioDB);
}

const usuariosPatch = ( req, res ) => {
    res.json({
        msg: 'patch API - desde el controlador'
    });
}

const usuariosDelete = async ( req, res ) => {

    const { id } = req.params;
    //borrar fisicamente 
    //const usuario = await Usuario.findByIdAndDelete( id );

    const usuario = await Usuario.findByIdAndUpdate( id, { status: false } );
    
    res.json({
        usuario
    });
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}