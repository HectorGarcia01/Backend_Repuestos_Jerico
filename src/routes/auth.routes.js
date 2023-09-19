const express = require('express');
const router = new express.Router();
const {
    login,
    logout,
    logoutAll
} = require('../controllers/auth.controller');
const authSchema = require('../schemas/auth.schema');
const validateMiddleware = require('../middlewares/validate');
const authMiddleware = require('../middlewares/auth');

router.post('/usuario/login', validateMiddleware(authSchema), login);
router.post('/usuario/logout', authMiddleware, logout);
router.post('/usuario/logoutAll', authMiddleware, logoutAll);

module.exports = router;