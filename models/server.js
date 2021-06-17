const express = require('express');
const cors = require('cors');
const { dbConection } = require('../DB/config');

class Server {
    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosPath = '/api/usuarios';
        this.authPath = '/api/auth';

        //conexion a la base de datos
        this.conectarDb();

        // Middlewares
        this.middleware();
        // rutas de mi aplicacion.
        this.routes();

    }

    async conectarDb() {
        await dbConection();
    }

    middleware() {
        // CORSE
        this.app.use( cors() );

        // Parseo y lectura del body
        this.app.use( express.json() );
        //Directorio publico
        this.app.use( express.static('public') );
    }

    routes() {
        this.app.use( this.authPath, require('../routes/auth'));
        this.app.use( this.usuariosPath , require('../routes/user'));
    }

    listen() {
        this.app.listen( this.port, () => {
            console.log(`Escuchando por el puerto ${ this.port }`);
        });
    }
}

module.exports = Server;