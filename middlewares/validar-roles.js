

const esAdmin = (req, res, next) => {

    if ( !req.usuario ) {
        return res.status(500).json({
            msg: 'Se quiere verificar el role sin validar el token'
        });
    }
    const { rol, name } = req.usuario;
    if( rol !== 'ADMIN_ROLE' ) {
        return res.status(401).json({
            msg: `${ name } no es administrador y no tiene los permisos `
        });
    }

    next();
}

const tieneRole = ( ...roles ) => {

    return (req, res, next) => {
        
        if ( !req.usuario ) {
            return res.status(500).json({
                msg: 'Se quiere verificar el role sin validar el token'
            });
        }

        if ( !roles.includes( req.usuario.rol ) ) {
            return res.status(401).json({
                msg: `El servicio requiere uno de estos roles ${ roles }`
            });
        }

        next();
    }
}

module.exports = {
    esAdmin,
    tieneRole
}