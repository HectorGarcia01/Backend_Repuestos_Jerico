const { PORT } = require('./config/config');
const express = require('express');
const db = require('./database/db_connection');

const app = express();

//Conexión a la base de datos
(async () => {
    try {
        await db.authenticate();
        await db.sync();
    } catch (error) {
        throw new Error(error);
    }
})();

//Configuración de cors
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE');
    res.setHeader("Access-Control-Allow-Headers", "Origin, Content-Type, Authorization");
    next();
});

app.use(express.json());

//Configuración del manejo de rutas inexistentes
app.get('*', (req, res) => {
    //Enviamos un estado de error 404 y un objeto
    res.status(404).send({
        title: '404',
        errorMessage: "Página no encontrada."
    });
});

//Inicializando el servidor 
app.listen(PORT, () => {
    console.log(`Servidor inicializado en el puerto: ${PORT}`);
});
