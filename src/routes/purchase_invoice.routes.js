const express = require('express');
const router = new express.Router();
const {
    createPurchaseInvoice
} = require('../controllers/purchase_invoice.controller');
// const { shoppingSchema } = require('../schemas/shopping.schema');
// const validateMiddleware = require('../middlewares/validate');
const authMiddleware = require('../middlewares/auth');
const roleMiddleware = require('../middlewares/check_role');

//Configuración de rutas (endpoints) para el SuperAdmin
router.post(
    '/superAdmin/nueva/compra',
    authMiddleware,
    roleMiddleware('SuperAdmin'),
    // validateMiddleware(shoppingSchema),
    createPurchaseInvoice
);

//Configuración de rutas (endpoints) para el Admin
router.post(
    '/admin/nueva/compra',
    authMiddleware,
    roleMiddleware('Admin'),
    // validateMiddleware(shoppingSchema),
    createPurchaseInvoice
);

module.exports = router;