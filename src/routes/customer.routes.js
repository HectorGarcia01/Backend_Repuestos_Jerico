const express = require('express');
const router = new express.Router();
const {
    createCustomer,
    readProfile,
    readCustomers,
    readCustomerId,
    updateCustomer
} = require('../controllers/customer.controller');
const { userSchema, updateUserSchema } = require('../schemas/user.schema');
const validateMiddleware = require('../middlewares/validate');
const authMiddleware = require('../middlewares/auth');
const roleMiddleware = require('../middlewares/check_role');

//Endpoints para el cliente
router.post('/nuevo/cliente', validateMiddleware(userSchema), createCustomer);
router.get('/usuario/ver/perfil', authMiddleware, roleMiddleware('User'), readProfile);
router.patch('/usuario/actualizar/perfil', authMiddleware, roleMiddleware('User'), validateMiddleware(updateUserSchema), updateCustomer);

//Enpoints para el admin/superAdmin
router.get('/admin/ver/clientes', authMiddleware, roleMiddleware('Admin'), readCustomers);
router.get('/admin/ver/cliente/:id', authMiddleware, roleMiddleware('Admin'), readCustomerId);
router.get('/superAdmin/ver/clientes', authMiddleware, roleMiddleware('SuperAdmin'), readCustomers);
router.get('/superAdmin/ver/cliente/:id', authMiddleware, roleMiddleware('SuperAdmin'), readCustomerId);

module.exports = router;