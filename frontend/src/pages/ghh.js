          {/* Profile Picture */}
          <div className="flex justify-center mb-6">
            <label className="relative cursor-pointer flex items-center justify-center w-24 h-24 border-2 border-teal-600 rounded-full">
              {profilePreview ? (
                <img src={profilePreview} alt="Profile" className="w-full h-full rounded-full object-cover" />
              ) : (
                <span className="text-sm text-gray-500">Add photo</span>
              )}
              <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleProfileChange} />
            </label>
          </div>
