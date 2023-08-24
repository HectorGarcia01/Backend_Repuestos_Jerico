const { DataTypes } = require('sequelize');
const db = require('../database/db_connection');

/**
 * Creación del modelo Direccion
 * Fecha creación: 22/08/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Modelo Cliente (customer.js)
 *              Modelo Empleado (employee.js)
 */

const Direccion = db.define('Direccion', {
    departamento: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    municipio: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    direccion_referencia: {
        type: DataTypes.STRING(40),
        allowNull: true
    },
    ID_Cliente_FK: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Clientes',
            key: 'id'
        }
    },
    ID_Empleado_FK: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Empleados',
            key: 'id'
        }
    }
});

/**
 * Método personalizado para filtrar información
 * Fecha creación: 22/08/2023
 * Autor: Hector Armando García González
 */

Direccion.prototype.toJSON = function () {
    const address = { ...this.get() };

    delete address.ID_Cliente_FK;
    delete address.ID_Empleado_FK;
    delete address.createdAt;
    delete address.updatedAt;

    return address;
};

module.exports = Direccion;