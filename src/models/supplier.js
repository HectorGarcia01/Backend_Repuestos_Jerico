const { DataTypes } = require('sequelize');
const db = require('../database/db_connection');
const Estado = require('../models/state');

/**
 * Creación del modelo Proveedor
 * Fecha creación: 02/09/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Modelo Estado (state.js)
 */

const Proveedor = db.define('JHSGR_Proveedor', {
    nombre: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true
    },
    apellido: {
        type: DataTypes.STRING(30),
        allowNull: true
    },
    empresa: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },
    telefono: {
        type: DataTypes.STRING(8),
        allowNull: false
    },
    correo: {
        type: DataTypes.STRING(30),
        allowNull: false,
        low: true,
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
 *              Modelo Proveedor (supplier.js) -> uno
 *              Modelo Estado (state.js)  -> uno
 */

Estado.hasOne(Proveedor, {
    foreignKey: 'ID_Estado_FK'
});

Proveedor.belongsTo(Estado, {
    foreignKey: 'ID_Estado_FK',
    as: 'estado'
});

/**
 * Método personalizado para filtrar información
 * Fecha creación: 02/09/2023
 * Autor: Hector Armando García González
 */

Proveedor.prototype.toJSON = function () {
    const supplier = { ...this.get() };

    delete supplier.ID_Estado_FK;
    delete supplier.createdAt;
    delete supplier.updatedAt;

    return supplier;
};

module.exports = Proveedor;