const { validationResult } = require('express-validator');
const Ticket = require('../models/Ticket');

const populateFields = [
  { path: 'createdBy', select: 'name email' },
  { path: 'assignedTo', select: 'name email' },
];

exports.getTickets = async (req, res, next) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { createdBy: req.user._id };
    const tickets = await Ticket.find(filter)
      .populate(populateFields)
      .sort({ updatedAt: -1 });

    res.json({ tickets });
  } catch (error) {
    next(error);
  }
};

exports.getTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id).populate(populateFields);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    const isOwner = ticket.createdBy._id.toString() === req.user._id.toString();
    if (req.user.role !== 'admin' && !isOwner) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    res.json({ ticket });
  } catch (error) {
    next(error);
  }
};

exports.createTicket = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const ticket = await Ticket.create({
      ...req.body,
      createdBy: req.user._id,
    });

    await ticket.populate(populateFields);
    res.status(201).json({ ticket });
  } catch (error) {
    next(error);
  }
};

exports.updateTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    const isOwner = ticket.createdBy.toString() === req.user._id.toString();
    if (req.user.role !== 'admin' && !isOwner) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    if (req.user.role !== 'admin') {
      delete req.body.status;
      delete req.body.assignedTo;
    }

    Object.assign(ticket, req.body);
    await ticket.save();
    await ticket.populate(populateFields);

    res.json({ ticket });
  } catch (error) {
    next(error);
  }
};

exports.deleteTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    const isOwner = ticket.createdBy.toString() === req.user._id.toString();
    if (req.user.role !== 'admin' && !isOwner) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await ticket.deleteOne();
    res.json({ message: 'Ticket deleted' });
  } catch (error) {
    next(error);
  }
};
