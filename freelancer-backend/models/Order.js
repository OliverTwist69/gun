const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  freelancer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  proposal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Proposal',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'USD'
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed', 'cancelled', 'disputed'],
    default: 'pending'
  },
  milestones: [{
    title: String,
    description: String,
    amount: Number,
    status: {
      type: String,
      enum: ['pending', 'completed', 'approved', 'rejected'],
      default: 'pending'
    },
    dueDate: Date,
    completedAt: Date
  }],
  deadline: {
    type: Date,
    required: true
  },
  deliverables: [{
    name: String,
    description: String,
    fileUrl: String,
    submittedAt: Date,
    approvedAt: Date
  }],
  paymentStatus: {
    type: String,
    enum: ['pending', 'partial', 'completed', 'refunded'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);