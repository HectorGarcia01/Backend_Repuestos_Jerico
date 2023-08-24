const express = require('express');
const router = new express.Router();
const {
    login,
    logout
} = require('../controllers/auth.controller');
const authSchema = require('../schemas/auth.schema');
const validateMiddleware = require('../middlewares/validate');
const authMiddleware = require('../middlewares/auth');

router.post('/usuario/login', validateMiddleware(authSchema), login);
router.post('/usuario/logout', authMiddleware, logout);

//Exportación de todas las rutas de autenticación
module.exports = router;