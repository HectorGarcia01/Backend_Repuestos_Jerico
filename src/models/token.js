const { DataTypes } = require('sequelize');
const db = require('../database/db_connection');

/**
 * Creación del modelo Token
 * Fecha creación: 22/08/2023
 * Autor: Hector Armando García González
 * Referencias: Modelo Cliente (customer.js),
 *              Modelo Empleado (employee.js)
 */

const Token = db.define('Token', {
    token_usuario: {
        type: DataTypes.STRING,
        allowNull: false
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

//Exportación del modelo Token
module.exports = Token;