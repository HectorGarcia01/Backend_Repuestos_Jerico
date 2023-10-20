const { DataTypes } = require('sequelize');
const db = require('../database/db_connection');

/**
 * Creación del modelo Ubicacion_Producto
 * Fecha creación: 29/09/2023
 * Autor: Hector Armando García González
 */

const Ubicacion_Producto = db.define(`JHSGR_Ubicacion_Producto`, {
    nombre_estanteria: {
        type: DataTypes.STRING(200),
        allowNull: false,
        unique: true
    }
});

module.exports = Ubicacion_Producto;