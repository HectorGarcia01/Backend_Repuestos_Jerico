const sharp = require('sharp');

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
        const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer();

        if (role === 'User') {
            user.foto_perfil = buffer;
        } else {
            user.foto_perfil = buffer;
        }

        await user.save();
        res.status(200).send({ msg: "Foto de perfil guardada con éxito." });
    } catch (error) {
        res.status(500).send({ error });
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

//Exportación de controladores para el manejo de imágen
module.exports = {
    addUserAvatar,
    getUserAvatar,
    deleteUserAvatar
};