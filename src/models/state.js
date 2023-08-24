const { DataTypes } = require('sequelize');
const db = require('../database/db_connection');

/**
 * Creación del modelo Estado
 * Fecha creación: 22/08/2023
 * Autor: Hector Armando García González
 */

const Estado = db.define('Estado', {
    Tipo_Estado: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        values: ['Pendiente', 'Activo', 'Inactivo'],
        defaultValue: 'Activo'
    }
});

module.exports = Estado;