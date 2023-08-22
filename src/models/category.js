const { DataTypes } = require('sequelize');
const db = require('../database/db_connection');

/**
 * Creación del modelo Categoria
 * Fecha creación: 22/08/2023
 * Autor: Hector Armando García González
 */

const Category = db.define('Categoria', {
    nombre_categoria: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

//Exportación del modelo Categoria
module.exports = Category;