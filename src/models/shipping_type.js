const { DataTypes } = require('sequelize');
const db = require('../database/db_connection');

/**
 * Creación del modelo Metodo_Pago
 * Fecha creación: 29/09/2023
 * Autor: Hector Armando García González
 */

const Metodo_Pago = db.define(`JHSGR_Metodo_Pago`, {
    tipo_pago: {
        type: DataTypes.STRING(40),
        allowNull: false,
        unique: true
    }
});

module.exports = Metodo_Pago;