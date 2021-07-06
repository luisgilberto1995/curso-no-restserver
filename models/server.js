
const express = require('express');
var cors = require('cors');
const { dbConnection } = require('../database/config');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosPath = '/api/usuarios';
        this.authPath     = '/api/auth';

        //Conectar a DB
        this.conectarDB();

        // Middlewares
        this.middlewares();

        // Rutas
        this.routes();
    }

    async conectarDB(){
        await dbConnection();
    }

    middlewares() {
        this.app.use(cors());
        // Lectura y parseo del body
        this.app.use( express.json() );
        this.app.use( express.static('public') );
    }

    routes() {
        this.app.use(this.usuariosPath, require('../routes/user'));
        this.app.use(this.authPath, require('../routes/auth'));
    }

    listen() {

        this.app.listen(this.port, () => {
            console.log("servidor corriendo en puerto: ", this.port);
        });
    }

}

module.exports = Server;