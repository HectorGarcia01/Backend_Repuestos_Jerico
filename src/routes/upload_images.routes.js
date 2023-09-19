const express = require('express');
const router = new express.Router();
const {
    addUserAvatar,
    getUserAvatar,
    deleteUserAvatar
} = require('../controllers/upload_images.controller');
const authMiddleware = require('../middlewares/auth');
const roleMiddleware = require('../middlewares/check_role');
const uploadMiddleware = require('../middlewares/upload_images');

//Configuración de rutas (endpoints) para el SuperAdmin
router.post(
    '/superAdmin/subir/fotoPerfil',
    authMiddleware,
    roleMiddleware('SuperAdmin'),
    uploadMiddleware.single('foto_perfil'),
    addUserAvatar,
    (error, req, res, next) => {
        res.status(400).send({ error: error.message });
    }
);
router.get('/superAdmin/ver/fotoPerfil', authMiddleware, roleMiddleware('SuperAdmin'), getUserAvatar);
router.delete('/superAdmin/eliminar/fotoPerfil', authMiddleware, roleMiddleware('SuperAdmin'), deleteUserAvatar);

//Configuración de rutas (endpoints) para el Admin
router.post(
    '/admin/subir/fotoPerfil',
    authMiddleware,
    roleMiddleware('Admin'),
    uploadMiddleware.single('foto_perfil'),
    addUserAvatar,
    (error, req, res, next) => {
        res.status(400).send({ error: error.message });
    }
);
router.get('/admin/ver/fotoPerfil', authMiddleware, roleMiddleware('Admin'), getUserAvatar);
router.delete('/admin/eliminar/fotoPerfil', authMiddleware, roleMiddleware('Admin'), deleteUserAvatar);

//Configuración de rutas (endpoints) para el User
router.post(
    '/usuario/subir/fotoPerfil',
    authMiddleware,
    roleMiddleware('User'),
    uploadMiddleware.single('foto_perfil'),
    addUserAvatar,
    (error, req, res, next) => {
        res.status(400).send({ error: error.message });
    }
);
router.get('/usuario/ver/fotoPerfil', authMiddleware, roleMiddleware('User'), getUserAvatar);
router.delete('/usuario/eliminar/fotoPerfil', authMiddleware, roleMiddleware('User'), deleteUserAvatar);

//Configuración de rutas (endpoints) para el producto


module.exports = router;