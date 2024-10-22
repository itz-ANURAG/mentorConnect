import React from "react";

const JobCard = () => {
  return (
    <div className="bg-white shadow-lg rounded-lg border border-gray-200 p-4 flex flex-col space-y-4 max-w-full sm:max-w-[600px] md:max-w-[700px] lg:max-w-[800px]">
      {/* Header Section */}
      <div className="flex items-center space-x-4">
        <img
          className="w-12 h-12 rounded-full object-cover border border-gray-300"
          src="https://via.placeholder.com/50"
          alt="profile"
        />
        <div className="flex-1">
          <h4 className="font-semibold text-gray-800">Azar Ahemad</h4>
          <p className="text-gray-500 text-sm">
            Software Developer @VoyageX AI | Building @DotAware
          </p>
        </div>
      </div>

      {/* Job Description Section */}
      <div className="text-left">
        <p className="text-gray-700 font-medium text-lg">
          <span className="text-blue-600 font-semibold">Avalara</span> is hiring
          for a Machine Learning Engineer
        </p>
        <p className="text-gray-600 text-sm mt-1">Experience: 0 - 1 years</p>
        <p className="text-gray-600 text-sm">Expected Salary: 15-25 LPA</p>
        {/* Simulating long text description */}
        <p className="text-gray-600 text-sm mt-2">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec
          odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla
          quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent
          mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum
          lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent
          per conubia nostra, per inceptos himenaeos. Curabitur sodales ligula in
          libero. Sed dignissim lacinia nunc. Curabitur tortor. Pellentesque nibh.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem reiciendis laborum expedita at distinctio, asperiores quas harum earum, soluta dolore consequatur consectetur nesciunt, eveniet dicta corrupti saepe quis est. Assumenda? Lorem ipsum dolor sit amet consectetur, adipisicing elit. Corrupti sint nesciunt aliquid dolor itaque consequuntur quasi tenetur quibusdam, magni repudiandae aperiam deserunt quidem modi sunt veritatis ipsam natus error accusantium.
          Fuga, tempore itaque non obcaecati repellendus dolorum laudantium eum praesentium culpa molestias blanditiis hic ullam excepturi maiores maxime cumque! Eum quidem ipsum repellendus necessitatibus maxime eaque in non, aut porro?
          Dolorem modi ex explicabo sunt facere! Distinctio laudantium autem repellat assumenda accusantium corporis officia beatae dolore nihil aperiam odit cum, enim qui. Ea obcaecati magni, accusantium expedita voluptas assumenda eius.
        </p>
      </div>

      {/* Company Logo Section */}
      <div className="flex justify-center py-3">
        <img
          src="https://via.placeholder.com/150x50"
          alt="Avalara logo"
          className="h-12 object-contain"
        />
      </div>

      {/* Action Bar */}
      <div className="border-t border-gray-200 pt-2">
        <div className="flex justify-between text-gray-600 text-sm">
          <div className="flex space-x-4">
            <span>👍 365</span>
            <span>💬 36 comments</span>
            <span>🔁 11 reposts</span>
          </div>
          <div className="flex space-x-2">
            <button className="text-blue-600 hover:text-blue-700 transition duration-200">
              Like
            </button>
            <button className="text-blue-600 hover:text-blue-700 transition duration-200">
              Comment
            </button>
            <button className="text-blue-600 hover:text-blue-700 transition duration-200">
              Repost
            </button>
            <button className="text-blue-600 hover:text-blue-700 transition duration-200">
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
