const express = require('express');
const router = new express.Router();
const {
    addUserAvatar,
    getUserAvatar,
    deleteUserAvatar,
    addProductPhoto,
    getProductPhoto,
    deleteProductPhoto
} = require('../controllers/upload_images.controller');
const authMiddleware = require('../middlewares/auth');
const roleMiddleware = require('../middlewares/check_role');
const uploadMiddleware = require('../middlewares/upload_images');

//Configuración de rutas (endpoints) para el SuperAdmin
router.post(
    '/superAdmin/subir/fotoPerfil',
    authMiddleware,
    roleMiddleware('SuperAdmin'),
    uploadMiddleware,
    addUserAvatar
);
router.get('/superAdmin/ver/fotoPerfil', authMiddleware, roleMiddleware('SuperAdmin'), getUserAvatar);
router.delete('/superAdmin/eliminar/fotoPerfil', authMiddleware, roleMiddleware('SuperAdmin'), deleteUserAvatar);

//Configuración de rutas (endpoints) para el Admin
router.post(
    '/admin/subir/fotoPerfil',
    authMiddleware,
    roleMiddleware('Admin'),
    uploadMiddleware,
    addUserAvatar
);
router.get('/admin/ver/fotoPerfil', authMiddleware, roleMiddleware('Admin'), getUserAvatar);
router.delete('/admin/eliminar/fotoPerfil', authMiddleware, roleMiddleware('Admin'), deleteUserAvatar);

//Configuración de rutas (endpoints) para el User
router.post(
    '/usuario/subir/fotoPerfil',
    authMiddleware,
    roleMiddleware('User'),
    uploadMiddleware,
    addUserAvatar
);
router.get('/usuario/ver/fotoPerfil', authMiddleware, roleMiddleware('User'), getUserAvatar);
router.delete('/usuario/eliminar/fotoPerfil', authMiddleware, roleMiddleware('User'), deleteUserAvatar);

//Configuración de rutas (endpoints) para el producto
router.post(
    '/superAdmin/subir/foto/producto/:id',
    authMiddleware,
    roleMiddleware('SuperAdmin'),
    uploadMiddleware,
    addProductPhoto
);
router.post(
    '/admin/subir/foto/producto/:id',
    authMiddleware,
    roleMiddleware('Admin'),
    uploadMiddleware,
    addProductPhoto
);
router.get('/superAdmin/ver/foto/producto/:id', authMiddleware, roleMiddleware('SuperAdmin'), getProductPhoto);
router.get('/admin/ver/foto/producto/:id', authMiddleware, roleMiddleware('Admin'), getProductPhoto);
router.delete('/superAdmin/eliminar/foto/producto/:id', authMiddleware, roleMiddleware('SuperAdmin'), deleteProductPhoto);
router.delete('/admin/eliminar/foto/producto/:id', authMiddleware, roleMiddleware('Admin'), deleteProductPhoto);

//Para productos en home
router.get('/usuario/ver/foto/producto/:id', getProductPhoto);

module.exports = router;