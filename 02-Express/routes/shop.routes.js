const express = require('express');
const path = require('path');
const rootDir = require('../utils/path.js');
const router = express.Router();

router.get('/product', (req, res, next) => {
	res.sendFile(path.join(rootDir, 'views', 'shop.html'));
});

module.exports = router;
