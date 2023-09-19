const Joi = require('joi');
const customError = require('../utils/custom_error');

/**
 * Esquema de validación de datos de Cliente y Empleado
 * Fecha creación: 22/08/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              custom_error.js (para errores personalizados)
 */

const userSchema = Joi.object({
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
    nit: Joi.number()
        .integer()
        .error((error) => {
            return customError("El NIT debe ser numérico.", error);
        }),
    correo: Joi.string()
        .email({ tlds: { allow: ['com'] } })
        .required()
        .trim()
        .error((error) => {
            return customError("El correo electrónico es obligatorio, debe de tener la extensión 'com' y debe ser válido.", error);
        }),
    password: Joi.string()
        .pattern(new RegExp('^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?!.*\\s).*$'))
        .min(8)
        .max(25)
        .required()
        .trim()
        .error((error) => {
            return customError("La contraseña es obligatoria y debe tener al menos 8 carácteres, al menos una letra mayúscula, una letra minúscula, un número y no puede contener espacios.", error);
        }),
    repetir_password: Joi.string()
        .valid(Joi.ref('password'))
        .required()
        .error((error) => {
            return customError("Las contraseñas no coinciden.", error);
        }),
    ID_Departamento_FK: Joi.number()
        .integer()
        .min(1)
        .error((error) => {
            return customError("El ID de departamento debe de ser numérico y no debe de ser negativo.", error);
        }),
    ID_Municipio_FK: Joi.number()
        .integer()
        .min(1)
        .error((error) => {
            return customError("El ID de municipio debe de ser numérico y no debe de ser negativo.", error);
        }),
    direccion_referencia: Joi.string()
        .trim()
});

//Exportación del esquema de validación
module.exports = userSchema;