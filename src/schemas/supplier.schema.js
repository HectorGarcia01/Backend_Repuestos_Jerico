const Joi = require('joi');
const customError = require('../utils/custom_error');

/**
 * Esquema de validación de datos de Proveedor
 * Fecha creación: 22/08/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              custom_error.js (para errores personalizados)
 */

const supplierSchema = Joi.object({
    nombre: Joi.string()
        .required()
        .trim()
        .error((error) => {
            return customError("El nombre es obligatorio.", error);
        }),
    apellido: Joi.string()
        .required()
        .trim()
        .error((error) => {
            return customError("El apellido es obligatorio.", error);
        }),
    telefono: Joi.string()
        .pattern(new RegExp('^[345][0-9]{7}'))
        .required()
        .trim()
        .error((error) => {
            return customError("El teléfono es obligatorio y debe de ser válido.", error);
        }),
    correo: Joi.string()
        .email({ tlds: { allow: ['com'] } })
        .required()
        .trim()
        .error((error) => {
            return customError("El correo electrónico es obligatorio, debe de tener la extensión 'com' y debe ser válido.", error);
        })
});

/**
 * Esquema de validación de actualización de datos de Proveedor
 * Fecha creación: 02/09/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              custom_error.js (para errores personalizados)
 */

const updateSupplierSchema = Joi.object({
    nombre: Joi.string()
        .trim()
        .error((error) => {
            return customError("Nombre inválido.", error);
        }),
    apellido: Joi.string()
        .trim()
        .error((error) => {
            return customError("Apellido inválido.", error);
        }),
    telefono: Joi.string()
        .pattern(new RegExp('^[345][0-9]{7}'))
        .trim()
        .error((error) => {
            return customError("Teléfono inválido.", error);
        }),
    correo: Joi.string()
        .email({ tlds: { allow: ['com'] } })
        .trim()
        .error((error) => {
            return customError("El correo electrónico debe de tener la extensión 'com' y debe ser válido.", error);
        })
});

//Exportación de los esquemas de validación
module.exports = {
    supplierSchema,
    updateSupplierSchema
};