const multer = require('multer');

/**
 * Middleware para la carga de imágenes
 * Fecha creación: 19/08/2023
 * Autor: Hector Armando García González
 */

const validateImage = (req, res, next) => {
    const upload = multer({
        limits: {
            fileSize: 2000000 //Máximo 2MB
        },
        fileFilter(req, file, cb) {
            if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
                return cb(new Error("Lo siento, solo se admiten imágenes con formato: png, jpg y jpeg."));
            }

            cb(undefined, true);
        }
    }).single('foto_perfil');

    upload(req, res, (error) => {
        if (error) {
            return res.status(400).send({ error: error.message });
        }

        next();
    });
}

module.exports = validateImage;