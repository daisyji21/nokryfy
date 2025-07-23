const express = require('express');
const router = express.Router();
const employerController = require('../controllers/employer.Controller');
//register employer
router.post('/create', employerController.createEmployer);
//get all employer
router.get('/', employerController.getAllEmployers);



module.exports = router;
