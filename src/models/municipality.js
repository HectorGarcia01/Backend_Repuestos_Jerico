const { DataTypes } = require('sequelize');
const db = require('../database/db_connection');
const Departamento = require('../models/department');

/**
 * Creación del modelo Municipio
 * Fecha creación: 19/09/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Modelo Departamento (department.js)
 */

const Municipio = db.define('JHSGR_Municipio', {
    nombre_municipio: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    ID_Departamento_FK: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'JHSGR_Departamentos',
            key: 'id'
        }
    },
});

/**
 * Configurando la relación de uno a muchos
 * Fecha creación: 19/09/2023
 * Autor: Hector Armando García González
 * Referencia:
 *              Modelo Departamento (department.js) -> uno
 *              Modelo Municipio (municipality.js)  -> muchos
 */

Departamento.hasMany(Municipio, {
    foreignKey: 'ID_Departamento_FK',
    as: 'municipios'
});

Municipio.belongsTo(Departamento, {
    foreignKey: 'ID_Departamento_FK',
    as: 'departamento' 
});

/**
 * Método personalizado para filtrar información
 * Fecha creación: 19/09/2023
 * Autor: Hector Armando García González
 * Referencia:
 *              Modelo Departamento (department.js)
 */

Municipio.prototype.toJSON = function () {
    const municipality = { ...this.get() };
    
    delete municipality.ID_Departamento_FK;
    delete municipality.createdAt;
    delete municipality.updatedAt;

    return municipality;
};

module.exports = Municipio;