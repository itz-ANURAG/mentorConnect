const mongoose = require('mongoose');

// Define the Review schema
const reviewSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true, // Message is mandatory
      trim: true, // Removes extra spaces from the message
    },
    rating: {
      type: Number,
      required: true, // Rating is mandatory
      min: 1, // Minimum allowed rating
      max: 5, // Maximum allowed rating
    },
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Refers to the user model for the reviewer (mentee)
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now, // Automatically sets the timestamp when the review is created
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Export the Review model
module.exports = mongoose.model('Review', reviewSchema);
