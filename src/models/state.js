const { DataTypes } = require('sequelize');
const db = require('../database/db_connection');

/**
 * Creación del modelo Estado
 * Fecha creación: 22/08/2023
 * Autor: Hector Armando García González
 */

const Estado = db.define('JHSGR_Estado', {
    nombre_estado: {
        type: DataTypes.STRING(9),
        allowNull: false,
        unique: true,
        values: ['Pendiente', 'Activo', 'Inactivo']
    }
});

module.exports = Estado;