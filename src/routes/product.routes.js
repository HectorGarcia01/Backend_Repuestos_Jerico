const express = require('express');
const router = new express.Router();
const {
    createProduct,
    readProducts,
    readProductId,
    updateProductId,
    deleteProductId
} = require('../controllers/product.controller');
const {
    productSchema,
    updateProductSchema
} = require('../schemas/product.schema');
const validateMiddleware = require('../middlewares/validate');
const authMiddleware = require('../middlewares/auth');
const roleMiddleware = require('../middlewares/check_role');

//Rutas (endpoints) para el SuperAdmin
router.post(
    '/superAdmin/crear/producto', 
    authMiddleware, 
    roleMiddleware('SuperAdmin'), 
    validateMiddleware(productSchema), 
    createProduct
);
router.get('/superAdmin/ver/productos', authMiddleware, roleMiddleware('SuperAdmin'), readProducts);
router.get('/superAdmin/ver/producto/:id', authMiddleware, roleMiddleware('SuperAdmin'), readProductId);
router.patch(
    '/superAdmin/actualizar/producto/:id', 
    authMiddleware, 
    roleMiddleware('SuperAdmin'), 
    validateMiddleware(updateProductSchema), 
    updateProductId
);
router.delete('/superAdmin/eliminar/producto/:id', authMiddleware, roleMiddleware('SuperAdmin'), deleteProductId);

//Rutas (endpoints) para el Admin
router.post(
    '/admin/crear/producto',
    authMiddleware, 
    roleMiddleware('Admin'), 
    validateMiddleware(productSchema), 
    createProduct
);
router.get('/admin/ver/productos', authMiddleware, roleMiddleware('Admin'), readProducts);
router.get('/admin/ver/producto/:id', authMiddleware, roleMiddleware('Admin'), readProductId);
router.patch(
    '/admin/actualizar/producto/:id', 
    authMiddleware, 
    roleMiddleware('Admin'), 
    validateMiddleware(updateProductSchema),
    updateProductId
);

//Rutas (endpoints) para el home
router.get('/usuario/ver/productos', readProducts);
router.get('/usuario/ver/producto/:id', readProductId);

module.exports = router;