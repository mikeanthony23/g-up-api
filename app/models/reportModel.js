const mongoose = require('mongoose')

const reportSchema = new mongoose.Schema(
  {
    gcashNumber: {
      type: Number,
      required: [true, 'A report must have a gcash number'],
    },
    gcashName: {
      type: String,
      required: [true, 'A report must have a gcash name'],
    },
    gcashRefNum: {
      type: Number,
      required: [true, 'A report must have a reference number'],
    },
    // category: [
    //   {
    //     type: String,
    //     required: [true, 'A report must have a category'],
    //   },
    // ],
    amount: {
      type: Number,
      required: [true, 'A report must have a amount'],
    },
    photos: [
      {
        type: String,
        required: [true, 'A report must have a photo'],
      },
    ],
    field: {
      type: String,
      required: [true, 'A report must have a field'],
    },
    date: {
      type: Date,
      required: [true, 'A report must have a date'],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    incidentReport: {
      type: String,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'deleted'],
      default: 'pending',
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Report must belong to a user.'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

const Report = mongoose.model('Report', reportSchema)

module.exports = Report
