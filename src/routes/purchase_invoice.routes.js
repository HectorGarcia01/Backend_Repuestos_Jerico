const express = require('express');
const router = new express.Router();
const {
    createPurchaseInvoice,
    readPurchaseInvoiceProcess,
    deleteProductIdPurchaseInvoice,
    deletePurchaseInvoiceProcess,
    changePurchaseInvoiceComplete
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
router.delete('/superAdmin/compra/eliminar/producto/:id', authMiddleware, roleMiddleware('SuperAdmin'), deleteProductIdPurchaseInvoice);
router.delete('/superAdmin/eliminar/compra/proceso', authMiddleware, roleMiddleware('SuperAdmin'), deletePurchaseInvoiceProcess);
router.patch(
    '/superAdmin/actualizar/estado/compra/completado',
    authMiddleware,
    roleMiddleware('SuperAdmin'),
    changePurchaseInvoiceComplete
);

//Configuración de rutas (endpoints) para el Admin
router.post(
    '/admin/nueva/compra',
    authMiddleware,
    roleMiddleware('Admin'),
    // validateMiddleware(shoppingSchema),
    createPurchaseInvoice
);
router.get('/admin/ver/compra/proceso', authMiddleware, roleMiddleware('Admin'), readPurchaseInvoiceProcess);
router.delete('/admin/compra/eliminar/producto/:id', authMiddleware, roleMiddleware('Admin'), deleteProductIdPurchaseInvoice);
router.delete('/admin/eliminar/compra/proceso', authMiddleware, roleMiddleware('Admin'), deletePurchaseInvoiceProcess);
router.patch(
    '/admin/actualizar/estado/compra/completado',
    authMiddleware,
    roleMiddleware('Admin'),
    changePurchaseInvoiceComplete
);

module.exports = router;