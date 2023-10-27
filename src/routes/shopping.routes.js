const express = require('express');
const router = new express.Router();
const {
    createShoppingCart,
    readShoppingCart,
    updateShoppingCart,
    deleteProductIdShoppingCart,
    deleteShoppingCart,
    processCustomerSale,
    cancelCustomerSaleId,
    shoppingHistory,
    shoppingHistoryId
} = require('../controllers/shopping.controller');
const { shoppingSchema } = require('../schemas/shopping.schema');
const validateMiddleware = require('../middlewares/validate');
const authMiddleware = require('../middlewares/auth');
const roleMiddleware = require('../middlewares/check_role');

router.post(
    '/usuario/carrito/agregar',
    authMiddleware,
    roleMiddleware('User'),
    validateMiddleware(shoppingSchema),
    createShoppingCart
);
router.patch(
    '/usuario/carrito/actualizar/producto',
    authMiddleware,
    roleMiddleware('User'),
    validateMiddleware(shoppingSchema),
    updateShoppingCart
);
router.get('/usuario/carrito/ver', authMiddleware, roleMiddleware('User'), readShoppingCart);
router.get('/usuario/historial/compras', authMiddleware, roleMiddleware('User'), shoppingHistory);
router.get('/usuario/historial/compras/:id', authMiddleware, roleMiddleware('User'), shoppingHistoryId);
router.delete('/usuario/carrito/eliminar/producto/:id', authMiddleware, roleMiddleware('User'), deleteProductIdShoppingCart);
router.delete('/usuario/carrito/eliminar', authMiddleware, roleMiddleware('User'), deleteShoppingCart);
router.delete('/usuario/compra/cancelar/:id', authMiddleware, roleMiddleware('User'), cancelCustomerSaleId);
router.patch('/usuario/carrito/procesar', authMiddleware, roleMiddleware('User'), processCustomerSale);

module.exports = router;