const { DataTypes } = require('sequelize');
const db = require('../database/db_connection');

/**
 * Creación del modelo Categoria
 * Fecha creación: 22/08/2023
 * Autor: Hector Armando García González
 */

const Categoria = db.define('Categoria', {
    nombre_categoria: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },
    descripcion_categoria: {
        type: DataTypes.STRING(200),
        allowNull: true
    },
    ID_Estado_FK: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Estados',
            key: 'id'
        }
    }
});

/**
 * Método personalizado para filtrar información
 * Fecha creación: 02/09/2023
 * Autor: Hector Armando García González
 */

Categoria.prototype.toJSON = function () {
    const category = { ...this.get() };

    delete category.createdAt;
    delete category.updatedAt;

    return category;
};

module.exports = Categoria;