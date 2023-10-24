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
        .pattern(new RegExp('^[^\\[\\]<>(){}_=\\\\|\\\'\';]+$'))
        .min(3)
        .max(30)
        .required()
        .trim()
        .error((error) => {
            return customError("El nombre es obligatorio, debe de tener un mínimo de 3 y un máximo de 30 carácteres.", error);
        }),
    apellido: Joi.string()
        .pattern(new RegExp('^[^\\[\\]<>(){}_=\\\\|\\\'\';]+$'))
        .min(3)
        .max(30)
        .trim()
        .error((error) => {
            return customError("El apellido, debe de tener un mínimo de 3 y un máximo de 30 carácteres.", error);
        }),
    empresa: Joi.string()
        .pattern(new RegExp('^[^\\[\\]<>(){}_=\\\\|\\\'\';]+$'))
        .min(3)
        .max(50)
        .required()
        .trim()
        .error((error) => {
            return customError("La empresa es obligatoria, debe de tener un mínimo de 3 y un máximo de 50 carácteres.", error);
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
        .pattern(new RegExp('^[^\\[\\]<>(){}_=\\\\|\\\'\';]+$'))
        .min(3)
        .max(30)
        .trim()
        .error((error) => {
            return customError("El nombre debe de tener un mínimo de 3 y un máximo de 30 carácteres.", error);
        }),
    apellido: Joi.string()
        .pattern(new RegExp('^[^\\[\\]<>(){}_=\\\\|\\\'\';]+$'))
        .min(3)
        .max(30)
        .trim()
        .error((error) => {
            return customError("El apellido, debe de tener un mínimo de 3 y un máximo de 30 carácteres.", error);
        }),
    empresa: Joi.string()
        .pattern(new RegExp('^[^\\[\\]<>(){}_=\\\\|\\\'\';]+$'))
        .min(3)
        .max(50)
        .trim()
        .error((error) => {
            return customError("La empresa debe de tener un mínimo de 3 y un máximo de 50 carácteres.", error);
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