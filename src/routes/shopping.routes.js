const express = require('express');
const router = new express.Router();
const {
    createShoppingCart,
    readShoppingCart,
    deleteProductIdShoppingCart,
    deleteShoppingCart
} = require('../controllers/shopping.controller');
// const { shoppingSchema, updateShoppingSchema } = require('../schemas/shopping.schema');
const validateMiddleware = require('../middlewares/validate');
const authMiddleware = require('../middlewares/auth');
const roleMiddleware = require('../middlewares/check_role');

router.post(
    '/usuario/carrito/agregar',
    authMiddleware,
    roleMiddleware('User'),
    // validateMiddleware(userSchema),
    createShoppingCart
);
router.get('/usuario/carrito/ver', authMiddleware, roleMiddleware('User'), readShoppingCart);
router.delete('/usuario/carrito/eliminar/producto/:id', authMiddleware, roleMiddleware('User'), deleteProductIdShoppingCart);
router.delete('/usuario/carrito/eliminar', authMiddleware, roleMiddleware('User'), deleteShoppingCart);

module.exports = router;