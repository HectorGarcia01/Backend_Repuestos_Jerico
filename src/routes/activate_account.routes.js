const express = require('express');
const router = new express.Router();
const { activateUserAccount } = require('../controllers/activate_account.controller');

router.post('/usuario/activar/cuenta', activateUserAccount);

module.exports = router;