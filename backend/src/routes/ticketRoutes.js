const express = require('express');
const ticketController = require('../controllers/ticketController');
const { protect } = require('../middleware/auth');
const { ticketValidation } = require('../validators');

const router = express.Router();

router.use(protect);

router.get('/', ticketController.getTickets);
router.get('/:id', ticketController.getTicket);
router.post('/', ticketValidation, ticketController.createTicket);
router.put('/:id', ticketValidation, ticketController.updateTicket);
router.delete('/:id', ticketController.deleteTicket);

module.exports = router;
