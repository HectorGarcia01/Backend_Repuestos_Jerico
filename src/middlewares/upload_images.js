const multer = require('multer');

/**
 * Middleware para la carga de imágenes
 * Fecha creación: 19/08/2023
 * Autor: Hector Armando García González
 */

const validateImage = multer({
    limits: {
        fileSize: 2000000 //Máximo 2MB
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
            return cb(new Error("Lo siento, solo se admiten imágenes con formato: png, jpg y jpeg."));
        }

        cb(undefined, true);
    }
});

module.exports = validateImage;