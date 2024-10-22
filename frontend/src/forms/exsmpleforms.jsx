import React from "react";

const Form = () => {
  return (
    <div className="h-full p-8 bg-white shadow-lg flex flex-col justify-center rounded-lg">
      <h5 className="text-5xl font-bold mb-6 text-blue-700">Create Post</h5>
      <form className="space-y-6">
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2" htmlFor="name">
            Tittle
          </label>
          <input
            type="text"
            id="name"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter tittle"
          />
        </div>
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2" htmlFor="email">
            Choose File
          </label>
          <input
            type="file"
            id="file"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Choose File"
          />
        </div>
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2" htmlFor="message">
            Message
          </label>
          <textarea
            id="message"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your message"
            rows="5"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Post
        </button>
      </form>
    </div>
  );
};

export default Form;
