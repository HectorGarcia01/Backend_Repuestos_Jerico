const { DataTypes } = require('sequelize');
const db = require('../database/db_connection');

/**
 * Creación del modelo Marca del Producto
 * Fecha creación: 29/09/2023
 * Autor: Hector Armando García González
 */

const Marca_Producto = db.define('JHSGR_Marca_Producto', {
    nombre_marca: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    }
});

module.exports = Marca_Producto;