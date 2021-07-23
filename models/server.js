
const express = require('express');
var cors = require('cors');
const { dbConnection } = require('../database/config');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
            usuariosPath: '/api/usuarios',
            authPath:'/api/auth',
            categoriasPath: '/api/categorias',
            productos: '/api/productos',
            buscar: '/api/buscar'
        }

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
        this.app.use(this.paths.usuariosPath, require('../routes/user'));
        this.app.use(this.paths.authPath, require('../routes/auth'));
        this.app.use(this.paths.categoriasPath, require('../routes/categorias'));
        this.app.use(this.paths.productos, require('../routes/productos'));
        this.app.use(this.paths.buscar, require('../routes/buscar'));
    }

    listen() {

        this.app.listen(this.port, () => {
            console.log("servidor corriendo en puerto: ", this.port);
        });
    }

}

module.exports = Server;