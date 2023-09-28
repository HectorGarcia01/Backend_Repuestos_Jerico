const Sequelize = require('sequelize');
const DepartmentModel = require('../models/department');
const MunicipalityModel = require('../models/municipality');

/**
 * Función para registrar una nueva dirección (departamento y municipio)
 * Fecha creación: 19/09/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Modelo Departamento (department.js), 
 *              Modelo Municipio (municipality.js)
 */

const createAddress = (req, res) => {
    try {
        
    } catch (error) {
        
    }
};

/**
 * Función para ver todas las direcciones
 * Fecha creación: 19/09/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Modelo Departamento (department.js), 
 *              Modelo Municipio (municipality.js)
 */

const readAddresses = async (req, res) => {
    try {
        const address = await DepartmentModel.findAll({
            include: [{
                model: MunicipalityModel,
                as: 'municipios'
            }]
        });

        if (address.length === 0) {
            return res.status(404).send({ error: "No hay registro de departamentos y municipios." });
        }

        res.status(200).send({ address });
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor." });
    }
};

module.exports = {
    readAddresses
};