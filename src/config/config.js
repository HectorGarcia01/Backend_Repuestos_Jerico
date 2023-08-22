require('dotenv').config({ path: `.dev.env` });

//Exportando las variables de entorno
module.exports = {
    PORT: process.env.PORT,
    DATABASE: process.env.DATABASE,
    USERNAME_DB: process.env.USERNAME_DB,
    PASSWORD_DB: process.env.PASSWORD_DB,
    HOST_DB: process.env.HOST_DB,
    KEY_TOKEN: process.env.KEY_TOKEN
};