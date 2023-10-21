const { DataTypes } = require('sequelize');
const db = require('../database/db_connection');

/**
 * Creación del modelo Permiso
 * Fecha creación: 22/08/2023
 * Autor: Hector Armando García González
 */

const Permiso = db.define(`JHSGR_Permiso`, {
    nombre_permiso: {
        type: DataTypes.STRING(10),
        allowNull: false,
        values: ['Crear', 'Ver', 'Modificar', 'Eliminar'],
        unique: true
    },
    descripcion_permiso: {
        type: DataTypes.STRING(200),
        allowNull: false
    }
});

module.exports = Permiso;