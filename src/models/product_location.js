const { DataTypes } = require('sequelize');
const db = require('../database/db_connection');
const Estado = require('../models/state');

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
 *              Modelo Ubicacion_Producto (product_location.js) -> uno
 *              Modelo Estado (state.js)  -> uno
 */

Estado.hasOne(Ubicacion_Producto, {
    foreignKey: 'ID_Estado_FK'
});

Ubicacion_Producto.belongsTo(Estado, {
    foreignKey: 'ID_Estado_FK',
    as: 'estado'
});

module.exports = Ubicacion_Producto;