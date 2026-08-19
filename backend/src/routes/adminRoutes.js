const express = require('express');
const adminController = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');
const { assignValidation, statusValidation } = require('../validators');

const router = express.Router();

router.use(protect, authorize('admin'));

router.get('/users', adminController.getUsers);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);

router.patch('/tickets/:id/assign', assignValidation, adminController.assignTicket);
router.patch('/tickets/:id/status', statusValidation, adminController.updateTicketStatus);

router.get('/reports', adminController.getReports);

module.exports = router;
