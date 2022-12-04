const { createUser } = require('../controllers/userController');

const router = require('express').Router();

router.post('/create/', createUser);

module.exports = router;
