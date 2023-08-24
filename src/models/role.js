const { DataTypes } = require('sequelize');
const db = require('../database/db_connection');

/**
 * Creación del modelo Rol
 * Fecha creación: 22/08/2023
 * Autor: Hector Armando García González
 */

const Rol = db.define('Rol', {
    nombre_rol: {
        type: DataTypes.STRING,
        allowNull: false,
        values: ['User', 'Admin', 'SuperAdmin']
    }
});

module.exports = Rol;