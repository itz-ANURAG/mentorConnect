import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const FeedbackPage = () => {
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(0);
  const { token } = useParams(); // Extract token from the URL
  const navigate = useNavigate();

  const handleMessageChange = (e) => setMessage(e.target.value);
  const handleRatingChange = (e) => setRating(Number(e.target.value));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || !rating) {
      toast.error('Please fill out all required fields.');
      return;
    }
    try {
      const response = await axios.post(
        `http://localhost:3000/sessions/feedback/${token}`,
        {
          message,
          rating,
        }
      );

      toast.success(response.data.message); // Display success toast
      navigate('/'); // Navigate to home
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || 'An error occurred');
      } else {
        toast.error('Something went wrong. Please try again later.');
      }
      console.error('Error submitting feedback:', error);
    }
  };

  const handleSkip = () => {
    navigate('/'); // Navigate to home without submitting feedback
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 py-10">
      <div className="max-w-lg w-full p-8 bg-gray-800 rounded-xl shadow-xl border border-gray-700 transition duration-300 hover:shadow-2xl">
        <h2 className="text-3xl font-semibold text-center text-white mb-6">
          Session Feedback
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label
              className="block text-lg font-medium text-gray-300 mb-2"
              htmlFor="message"
            >
              Your Message <span className="text-red-500">*</span>
            </label>
            <textarea
              id="message"
              className="w-full p-4 border border-gray-600 rounded-xl text-white bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300"
              rows="4"
              value={message}
              onChange={handleMessageChange}
              placeholder="Provide feedback on your session"
              required
            ></textarea>
          </div>

          <div className="mb-8">
            <label
              className="block text-lg font-medium text-gray-300 mb-2"
              htmlFor="rating"
            >
              Rating (Out of 5) <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <label key={star} className="cursor-pointer">
                  <input
                    type="radio"
                    name="rating"
                    value={star}
                    checked={rating === star}
                    onChange={handleRatingChange}
                    className="hidden"
                    required
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-8 w-8 ${
                      rating >= star ? 'text-yellow-400' : 'text-gray-500'
                    }`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 17l-5.5 3 2-6.5-5-4h6.5L12 2l2 6.5H20l-5 4 2 6.5z" />
                  </svg>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={handleSkip}
              className="px-6 py-2 bg-green-600 text-white font-semibold text-lg rounded-full hover:bg-gray-600 focus:outline-none transition duration-200"
            >
              Skip
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-blue-600 text-white font-semibold text-lg rounded-full hover:bg-blue-700 focus:outline-none transition duration-200"
            >
              Submit Feedback
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackPage;
