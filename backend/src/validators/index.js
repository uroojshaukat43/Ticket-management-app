const { body } = require('express-validator');
const Ticket = require('../models/Ticket');

const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

const ticketValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('priority')
    .optional()
    .isIn(Ticket.PRIORITIES)
    .withMessage('Invalid priority'),
  body('status')
    .optional()
    .isIn(Ticket.STATUSES)
    .withMessage('Invalid status'),
];

const assignValidation = [
  body('assignedTo').notEmpty().withMessage('Assignee is required'),
];

const statusValidation = [
  body('status')
    .isIn(Ticket.STATUSES)
    .withMessage('Invalid status'),
];

module.exports = {
  registerValidation,
  loginValidation,
  ticketValidation,
  assignValidation,
  statusValidation,
};
