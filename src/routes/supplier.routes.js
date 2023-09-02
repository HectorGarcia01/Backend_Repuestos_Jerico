const express = require('express');
const router = new express.Router();
const {
    createSupplier
} = require('../controllers/supplier.controller');
const supplierSchema = require('../schemas/supplier.schema');
const validateMiddleware = require('../middlewares/validate');
const authMiddleware = require('../middlewares/auth');
const roleMiddleware = require('../middlewares/check_role');

//Configuración de rutas (endpoints) para el SuperAdmin
router.post(
    '/superAdmin/nuevo/proveedor',
    authMiddleware,
    roleMiddleware('SuperAdmin'),
    validateMiddleware(supplierSchema),
    createSupplier
);

//Configuración de rutas (endpoints) para el Admin
router.post(
    '/admin/nuevo/proveedor',
    authMiddleware,
    roleMiddleware('Admin'),
    validateMiddleware(supplierSchema),
    createSupplier
);

//Exportación de todas las rutas de proveedor
module.exports = router;