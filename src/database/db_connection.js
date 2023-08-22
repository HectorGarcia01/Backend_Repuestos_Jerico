const { Sequelize } = require('sequelize');
const {
    DATABASE,
    USERNAME_DB,
    PASSWORD_DB,
    HOST_DB
} = require('../config/config');

/**
 * Configuración de la conexión a la base de datos
 * Fecha creación: 22/08/2023
 * Autor: Hector Armando García González
 */

const db = new Sequelize(DATABASE, USERNAME_DB, PASSWORD_DB, {
    host: HOST_DB,
    dialect: 'mysql'
});

//Exportación de la configuración de db
module.exports = db;