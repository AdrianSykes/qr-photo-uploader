Const express = require(‘express’);
Const router = express.Router();
Const adminController = require(‘../controllers/adminController’);
Const auth = require(‘../middleware/auth’);
Const admin = require(‘../middleware/admin’); // Assuming you have an admin middleware

Router.delete(‘/images/:id’, auth, admin, adminController.deleteImage);
Router.get(‘/images’, auth, admin, adminController.getAllImages); // Route to fetch all images for admin panel

Module.exports = router;

