const { validationResult } = require('express-validator');
const User = require('../models/User');
const Ticket = require('../models/Ticket');

const formatUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  isActive: user.isActive,
  createdAt: user.createdAt,
});

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ users: users.map(formatUser) });
  } catch (error) {
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user._id.toString() === req.user._id.toString() && req.body.isActive === false) {
      return res.status(400).json({ message: 'Cannot deactivate your own account' });
    }

    const { name, role, isActive } = req.body;
    if (name !== undefined) user.name = name;
    if (role !== undefined) user.role = role;
    if (isActive !== undefined) user.isActive = isActive;

    await user.save();
    res.json({ user: formatUser(user) });
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.deleteOne();
    res.json({ message: 'User deleted' });
  } catch (error) {
    next(error);
  }
};

exports.assignTicket = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    const assignee = await User.findById(req.body.assignedTo);
    if (!assignee || !assignee.isActive) {
      return res.status(400).json({ message: 'Invalid assignee' });
    }

    ticket.assignedTo = assignee._id;
    if (ticket.status === 'Open') {
      ticket.status = 'In Progress';
    }

    await ticket.save();
    await ticket.populate([
      { path: 'createdBy', select: 'name email' },
      { path: 'assignedTo', select: 'name email' },
    ]);

    res.json({ ticket });
  } catch (error) {
    next(error);
  }
};

exports.updateTicketStatus = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    ticket.status = req.body.status;
    await ticket.save();
    await ticket.populate([
      { path: 'createdBy', select: 'name email' },
      { path: 'assignedTo', select: 'name email' },
    ]);

    res.json({ ticket });
  } catch (error) {
    next(error);
  }
};

exports.getReports = async (req, res, next) => {
  try {
    const [statusStats, priorityStats, totalTickets, totalUsers, recentTickets] =
      await Promise.all([
        Ticket.aggregate([
          { $group: { _id: '$status', count: { $sum: 1 } } },
          { $sort: { _id: 1 } },
        ]),
        Ticket.aggregate([
          { $group: { _id: '$priority', count: { $sum: 1 } } },
          { $sort: { _id: 1 } },
        ]),
        Ticket.countDocuments(),
        User.countDocuments({ role: 'user' }),
        Ticket.find()
          .populate('createdBy', 'name email')
          .populate('assignedTo', 'name email')
          .sort({ createdAt: -1 })
          .limit(5),
      ]);

    res.json({
      reports: {
        totalTickets,
        totalUsers,
        byStatus: statusStats,
        byPriority: priorityStats,
        recentTickets,
      },
    });
  } catch (error) {
    next(error);
  }
};
