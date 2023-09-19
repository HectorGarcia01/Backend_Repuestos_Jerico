const { DataTypes } = require('sequelize');
const db = require('../database/db_connection');

/**
 * Creación del modelo Departamento
 * Fecha creación: 19/09/2023
 * Autor: Hector Armando García González
 */

const Departamento = db.define('JHSGR_Departamento', {
    nombre_departamento: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true
    }
});

/**
 * Método personalizado para filtrar información
 * Fecha creación: 19/09/2023
 * Autor: Hector Armando García González
 */

Departamento.prototype.toJSON = function () {
    const department = { ...this.get() };

    delete department.createdAt;
    delete department.updatedAt;

    return department;
};

module.exports = Departamento;