const mongoose = require('mongoose');

const auctionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  category: {
    type: String,
    required: [true, 'Please select a category'],
    enum: ['Electronics', 'Fashion', 'Art', 'Automotive', 'Real Estate', 'Other'],
  },
  startingPrice: {
    type: Number,
    required: [true, 'Please add a starting price'],
  },
  currentPrice: {
    type: Number,
    // FIX: Set default based on startingPrice directly here.
    // This removes the need for the pre-save hook that was crashing.
    default: function() {
      return this.startingPrice;
    }
  },
  startTime: {
    type: Date,
    default: Date.now,
  },
  endTime: {
    type: Date,
    required: [true, 'Please add an end time'],
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  bids: [
    {
      bidder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      amount: { type: Number, required: true },
      time: { type: Date, default: Date.now },
    },
  ],
  status: {
    type: String,
    enum: ['active', 'completed', 'unsold'],
    default: 'active',
  },
  // FIX: Simplified Array of Strings definition
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// REMOVED: The pre('save') hook was deleted because we handled the logic in the 'default' field above.
// This eliminates the "next is not a function" error.

module.exports = mongoose.model('Auction', auctionSchema);