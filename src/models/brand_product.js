const { DataTypes } = require('sequelize');
const db = require('../database/db_connection');
const Estado = require('../models/state');

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
    },
    ID_Estado_FK: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'JHSGR_Estados',
            key: 'id'
        }
    }
});

/**
 * Configurando la relación de uno a uno
 * Fecha creación: 29/09/2023
 * Autor: Hector Armando García González
 * Referencia:
 *              Modelo Marca_Producto (brand_product.js) -> uno
 *              Modelo Estado (state.js)  -> uno
 */

Estado.hasOne(Marca_Producto, {
    foreignKey: 'ID_Estado_FK'
});

Marca_Producto.belongsTo(Estado, {
    foreignKey: 'ID_Estado_FK',
    as: 'estado'
});

/**
 * Método personalizado para filtrar información
 * Fecha creación: 29/09/2023
 * Autor: Hector Armando García González
 */

Marca_Producto.prototype.toJSON = function () {
    const brand_product = { ...this.get() };

    delete brand_product.ID_Estado_FK;
    delete brand_product.createdAt;
    delete brand_product.updatedAt;

    return brand_product;
};

module.exports = Marca_Producto;