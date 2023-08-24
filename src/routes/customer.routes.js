const express = require('express');
const router = new express.Router();
const {
    createCustomer,
    readProfile,
    updateCustomer
} = require('../controllers/customer.controller');
const customerSchema = require('../schemas/user.schema');
const validateMiddleware = require('../middlewares/validate');
const authMiddleware = require('../middlewares/auth');
const roleMiddleware = require('../middlewares/check_role');

router.post('/nuevo/cliente', validateMiddleware(customerSchema), createCustomer);
router.get('/usuario/ver/perfil', authMiddleware, roleMiddleware('User'), readProfile);
router.patch('/usuario/actualizar/perfil', authMiddleware, roleMiddleware('User'), updateCustomer);

//Exportación de todas las rutas de cliente
module.exports = router;