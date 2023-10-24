const Sequelize = require('sequelize');
const sharp = require('sharp');
const ProductModel = require('../models/product');

/**
 * Función para subir/actualizar imágen del Cliente/Empleado
 * Fecha creación: 19/09/2023
 * Autor: Hector Armando García González
 */

const addUserAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send({ error: "No se proporcionó una imágen para subir." });
        }

        const { user, role } = req;
        const buffer = await sharp(req.file.buffer).resize({ 
            width: 250, 
            height: 250 
        }).png({ compressionLevel: 9 }).toBuffer();

        if (role === 'User') {
            user.foto_perfil = buffer;
        } else {
            user.foto_perfil = buffer;
        }

        await user.save();
        res.status(200).send({ msg: "Foto de perfil guardada con éxito." });
    } catch (error) {
        if (error instanceof Sequelize.ValidationError) {
            const lenError = error.errors.find(validationError => validationError.validatorKey === 'len');
            if (lenError) {
                res.status(400).send({ error: "Error al procesar la imágen, por favor intenta con otra." });
            }
        } else {
            res.status(500).send({ error: "Error interno del servidor. " });
        }
    }
};

/**
 * Función para obtener imágen del Cliente/Empleado
 * Fecha creación: 19/09/2023
 * Autor: Hector Armando García González
 */

const getUserAvatar = async (req, res) => {
    try {
        const { user } = req;
        const avatar = user.foto_perfil || user.foto_perfil;

        if (!avatar) {
            return res.status(404).send({ error: "No posees foto de perfil." });
        }

        res.set('Content-Type', 'image/png');
        res.status(200).send(avatar);
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor." });
    }
};

/**
 * Función para eliminar imágen del Cliente/Empleado
 * Fecha creación: 19/09/2023
 * Autor: Hector Armando García González
 */

const deleteUserAvatar = async (req, res) => {
    try {
        const { user, role } = req;

        if (role === 'User') {
            user.foto_perfil = null;
        } else {
            user.foto_perfil = null;
        }

        await user.save();
        res.status(200).send({ msg: "Foto de perfil eliminada con éxito." });
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor." });
    }
}

/**
 * Función para subir/actualizar imágen del producto
 * Fecha creación: 19/09/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Modelo Producto (product.js)
 */

const addProductPhoto = async (req, res) => {
    try {
        const { id } = req.params;

        if (!req.file) {
            return res.status(400).send({ error: "No se proporcionó una imágen para subir." });
        }

        const buffer = await sharp(req.file.buffer).resize({ 
            width: 250, 
            height: 250 
        }).png({ compressionLevel: 9 }).toBuffer();

        const product = await ProductModel.findByPk(id);

        if (!product) {
            return res.status(404).send({ error: "Producto no encontrado." });
        }

        product.imagen_producto = buffer;
        
        await product.save();
        res.status(200).send({ msg: "Imagen del producto guardada con éxito." });
    } catch (error) {
        if (error instanceof Sequelize.ValidationError) {
            const lenError = error.errors.find(validationError => validationError.validatorKey === 'len');
            if (lenError) {
                res.status(400).send({ error: "Error al procesar la imágen, por favor intenta con otra." });
            }
        } else {
            res.status(500).send({ error: "Error interno del servidor. " });
        }
    }
};

/**
 * Función para obtener imágen del producto
 * Fecha creación: 19/09/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Modelo Producto (product.js)
 */

const getProductPhoto = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await ProductModel.findByPk(id);

        if (!product) {
            return res.status(404).send({ error: "Producto no encontrado." });
        }

        const image = product.imagen_producto;

        if (!image) {
            return res.status(404).send({ error: "El producto no posee una imagen." });
        }

        res.set('Content-Type', 'image/png');
        res.status(200).send(image);
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor." });
    }
};

/**
 * Función para eliminar imágen del producto
 * Fecha creación: 19/09/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Modelo Producto (product.js)
 */

const deleteProductPhoto = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await ProductModel.findByPk(id);

        if (!product) {
            return res.status(404).send({ error: "Producto no encontrado." });
        }

        product.imagen_producto = null;

        await product.save();
        res.status(200).send({ msg: "Imagen del producto eliminada con éxito." });
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor." });
    }
}

//Exportación de controladores para el manejo de imágen
module.exports = {
    addUserAvatar,
    getUserAvatar,
    deleteUserAvatar,
    addProductPhoto,
    getProductPhoto,
    deleteProductPhoto
};