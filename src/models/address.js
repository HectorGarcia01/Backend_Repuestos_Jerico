const { DataTypes } = require('sequelize');
const db = require('../database/db_connection');

/**
 * Creación del modelo Direccion
 * Fecha creación: 22/08/2023
 * Autor: Hector Armando García González
 */

const Direccion = db.define('Direccion', {
    departamento: {
        type: DataTypes.STRING(30),
        allowNull: true
    },
    municipio: {
        type: DataTypes.STRING(30),
        allowNull: true
    }
});

/**
 * Método personalizado para filtrar información
 * Fecha creación: 22/08/2023
 * Autor: Hector Armando García González
 */

Direccion.prototype.toJSON = function () {
    const address = { ...this.get() };

    delete address.createdAt;
    delete address.updatedAt;

    return address;
};

module.exports = Direccion;