const { DataTypes } = require('sequelize');
const db = require('../database/db_connection');

/**
 * Creación del modelo Tipo_Envio
 * Fecha creación: 29/09/2023
 * Autor: Hector Armando García González
 */

const Tipo_Envio = db.define(`JHSGR_Tipo_Envio`, {
    nombre_envio: {
        type: DataTypes.STRING(40),
        allowNull: false,
        unique: true
    }
});

module.exports = Tipo_Envio;