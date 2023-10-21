const express = require('express');
const router = new express.Router();
const {
    createProductLocation
} = require('../controllers/product_location.controller');
// const {
//     categorySchema,
//     updateCategorySchema
// } = require('../schemas/category.schema');
const validateMiddleware = require('../middlewares/validate');
const authMiddleware = require('../middlewares/auth');
const roleMiddleware = require('../middlewares/check_role');

//Configuración de rutas (endpoints) para el SuperAdmin
router.post(
    '/superAdmin/crear/ubicacion',
    authMiddleware,
    roleMiddleware('SuperAdmin'),
    // validateMiddleware(categorySchema),
    createProductLocation
);

//Configuración de rutas (endpoints) para el Admin
router.post(
    '/admin/crear/ubicacion',
    authMiddleware,
    roleMiddleware('Admin'),
    // validateMiddleware(categorySchema),
    createProductLocation
);

module.exports = router;