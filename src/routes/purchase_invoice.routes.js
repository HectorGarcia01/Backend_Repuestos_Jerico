const express = require('express');
const router = new express.Router();
const {
    createPurchaseInvoice,
    readPurchaseInvoiceProcess
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
router.get('/superAdmin/ver/compra/proceso', authMiddleware, roleMiddleware('SuperAdmin'), readPurchaseInvoiceProcess);

//Configuración de rutas (endpoints) para el Admin
router.post(
    '/admin/nueva/compra',
    authMiddleware,
    roleMiddleware('Admin'),
    // validateMiddleware(shoppingSchema),
    createPurchaseInvoice
);
router.get('/admin/ver/compra/proceso', authMiddleware, roleMiddleware('Admin'), readPurchaseInvoiceProcess);

module.exports = router;