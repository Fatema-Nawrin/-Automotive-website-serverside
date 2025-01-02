const express = require('express');
const router = express.Router();
const { getAllUsers, getUserByEmail, checkAdmin, setAdmin, upsertUser, updateUserInfo } = require('../controllers/usersController');
const verifyAdmin = require('../middlewares/admin');
const verifyJWT = require('../middlewares/auth');

router.get('/', verifyJWT, getAllUsers);
router.get('/:email', verifyJWT, getUserByEmail);
router.get('/admin/:email', checkAdmin);
router.put('/admin/:email', verifyJWT, verifyAdmin, setAdmin);
router.put('/:email', upsertUser);
router.put('/userinfo/:email', updateUserInfo);

module.exports = router;
