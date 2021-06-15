const Role = require('../models/role');
const Usuario = require('../models/usuario');

const roleValido = async (rol = '') => {
    const existeRol = await Role.findOne({ rol });
    if (!existeRol) {
        throw new Error(`El rol ${ rol } no esta registrado en la bse de datos`);
    }
}

const emailExiste = async ( email ) => {
    // verificar que el correo exista y si existe no dejar registrarlo.
    const existeEmail = await Usuario.findOne({ email })
    if (existeEmail) {
        throw new Error(`El correo ${ email } ya esta registrado!`)
    }
}

const existeUsuario = async ( id ) => {
   
    const usuario = await Usuario.findById(id)
    if ( !usuario ) {
        throw new Error(`El id ${ id } no esta asignado a nigun usuario`)
    }
}

module.exports = {
    roleValido,
    emailExiste,
    existeUsuario
}