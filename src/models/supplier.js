const { DataTypes } = require('sequelize');
const db = require('../database/db_connection');

/**
 * Creación del modelo Proveedor
 * Fecha creación: 02/09/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Modelo Estado (state.js)
 */

const Proveedor = db.define('Proveedor', {
    nombre: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    apellido: {
        type: DataTypes.STRING(30),
        allowNull: false
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
            model: 'Estados',
            key: 'id'
        }
    }
});

/**
 * Método personalizado para filtrar información
 * Fecha creación: 22/08/2023
 * Autor: Hector Armando García González
 */

Proveedor.prototype.toJSON = function () {
    const supplier = { ...this.get() };

    delete supplier.createdAt;
    delete supplier.updatedAt;

    return supplier;
};

module.exports = Proveedor;