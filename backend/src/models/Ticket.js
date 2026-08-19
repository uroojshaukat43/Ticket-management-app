const mongoose = require('mongoose');

const TICKET_STATUSES = ['Open', 'In Progress', 'Resolved', 'Closed'];
const TICKET_PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: TICKET_STATUSES,
      default: 'Open',
    },
    priority: {
      type: String,
      enum: TICKET_PRIORITIES,
      default: 'Medium',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { timestamps: true }
);

ticketSchema.statics.STATUSES = TICKET_STATUSES;
ticketSchema.statics.PRIORITIES = TICKET_PRIORITIES;

module.exports = mongoose.model('Ticket', ticketSchema);
