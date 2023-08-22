/**
 * Función para crear errores personalizados en los esquemas
 * Fecha creación: 22/08/2023
 * Autor: Hector Armando García González
 */

const customError = (message, detail) => {
    const error = new Error(message);
    error.detail = detail;

    return error;
};

//Exportación de la función de errores personalizados
module.exports = customError;