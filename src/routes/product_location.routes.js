const express = require('express');
const router = new express.Router();
const {
    createProductLocation,
    readProductLocation,
    readProductLocationId,
    updateProductLocationId
} = require('../controllers/product_location.controller');
const {
    productLocationSchema,
    updateProductLocationSchema
} = require('../schemas/product_location.schema');
const validateMiddleware = require('../middlewares/validate');
const authMiddleware = require('../middlewares/auth');
const roleMiddleware = require('../middlewares/check_role');

//Configuración de rutas (endpoints) para el SuperAdmin
router.post(
    '/superAdmin/crear/ubicacion',
    authMiddleware,
    roleMiddleware('SuperAdmin'),
    validateMiddleware(productLocationSchema),
    createProductLocation
);
router.get('/superAdmin/ver/ubicaciones', authMiddleware, roleMiddleware('SuperAdmin'), readProductLocation);
router.get('/superAdmin/ver/ubicacion/:id', authMiddleware, roleMiddleware('SuperAdmin'), readProductLocationId);
router.patch(
    '/superAdmin/actualizar/ubicacion/:id',
    authMiddleware,
    roleMiddleware('SuperAdmin'),
    validateMiddleware(updateProductLocationSchema),
    updateProductLocationId
);

//Configuración de rutas (endpoints) para el Admin
router.post(
    '/admin/crear/ubicacion',
    authMiddleware,
    roleMiddleware('Admin'),
    validateMiddleware(productLocationSchema),
    createProductLocation
);
router.get('/admin/ver/ubicaciones', authMiddleware, roleMiddleware('Admin'), readProductLocation);
router.get('/admin/ver/ubicacion/:id', authMiddleware, roleMiddleware('Admin'), readProductLocationId);
router.patch(
    '/admin/actualizar/ubicacion/:id',
    authMiddleware,
    roleMiddleware('Admin'),
    validateMiddleware(updateProductLocationSchema),
    updateProductLocationId
);

module.exports = router;