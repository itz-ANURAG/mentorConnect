# MentorConnect

**MentorConnect** is a comprehensive platform designed to foster mentorship and facilitate growth for its users. Inspired by the **Student Mentorship Program (SMP)** at our college and aligned with themes from **Smart India Hackathon (SIH)**, MentorConnect bridges the gap between mentors and mentees, providing a unified space for mentorship, learning, and collaboration.

We believe that having a good mentor can significantly boost one’s journey, both academically and beyond. This belief shaped the vision of MentorConnect.

---

## About MentorConnect

MentorConnect caters to the needs of both mentors and mentees, offering a feature-rich platform with:

- **Community Section**: A collaborative space where mentors act as admins to post messages, updates, and resources. Users can react and engage with these posts.
- **One-on-One and Group Sessions**: Facilitates personalized video calls and larger group sessions, complete with chat, file sharing, and link sharing capabilities.
- **Dynamic Filter-Based Searching**: Advanced search functionality to find mentors or mentees based on interests, skills, or expertise.
- **Automatic Slot Booking**: A seamless system for mentees to book available slots with mentors, simplifying session scheduling.
- **General Posts**: A platform for users to share achievements, raise queries, or express ideas.
- **Tagging and Compatibility**: A sophisticated tagging system to match mentees with mentors based on shared interests, ensuring meaningful mentorship connections.
- **Feedback and Ratings**: Mentees can provide feedback and rate mentors after sessions to ensure accountability and quality.
- **Two-Step Authentication**: Robust security mechanisms to safeguard user data.

MentorConnect is more than just a platform—it's a stepping stone to growth and success, empowering users to achieve their goals with guidance from experienced mentors.

---

## Getting Started

## Client Setup

The client-side of the CodeSangam platform is built using React. To run the client locally, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/itz-ANURAG/mentorConnect.git
   ```

2. Navigate to the client folder:

   ```bash
   cd frontend
   ```

3. Create a `.env` file for the client and add the following environment variables:
   ```bash
   VITE_GOOGLE_MAPS_API_KEY=<Your Google-Maps API KEY>
   ```
4. Install dependencies:

   ```bash
   npm install
   ```

5. Start the client:
   ```bash
   npm run dev
   ```
   The client will now be running on `http://localhost:5173`.

## Server Setup

The server-side of mentorConnect is responsible for handling API requests, user authentication, and other backend functionality. To run the server locally, follow these steps:

1. Navigate to the Backend folder:

   ```bash
   cd Backend
   ```

2. Create a `.env` file for the server with the following environment variables:

```bash
PORT=<Your Port no>

#Frontend configuration
FRONTEND_URL=http://localhost:5173/

#Mongodb URI
MONGO_URI=<Your mongoDb database url>
 
#Cloudinary setup
CLOUD_NAME=<Your cloud name>
API_KEY=<Your API key>
API_SECRET=<Your API Secret>
FOLDER_NAME=<Your Folder name>


#Nodemailer setup
MAIL_HOST=<Your Host type>
MAIL_USER=<Your Email>
MAIL_PASS=<Your main passkey>


#JWT secret
JWT_SECRET=<Your JWT Secret>


#Google Auth Setup
CLIENT_ID=<Your GoogleOauth Client Id>
CLIENT_SECRET=<Your GoogleOauth Client Secret>
CALLBACK_URL =<Your GoogleOauth Callback URl> 
```

   - `PORT`: The port number where the server will run.
   - OAuth variables (`CLIENT_ID`, `CLIENT_SECRET`, `CALLBACK_URL`): Used for authentication with OAuth.
   - `JWT_SECRET`: Used to encrypt and bcrypt JWT tokens.
   - `MONGO_URI`: Your MondoDb Cluster/Database base URL.
   - NodeMailer variables (`MAIL_HOST`, `MAIL_USER`, `MAIL_PASSKEY`): Used for sending mail to Users.
   - Cloudinary variables (`CLOUD_NAME`, `API_KEY`, `API_SECRET , `FOLDER_NAME`): Used for Cloudinary setup to store images.

3. Install dependencies:

   ```bash
   npm install
   ```

4. Run the server:
   ```bash
   npx nodemon
   ```

The server will now be running on `http://localhost:<PORT>`.


## Collaborators

We appreciate the contributions and efforts of the following collaborators:

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/itz-ANURAG">
        <img src="https://github.com/itz-ANURAG.png" width="100px;" alt="John Doe"/><br />
        <sub><b>Anurag Gupta</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/raaj6395">
        <img src="https://github.com/raaj6395.png" width="100px;" alt="Jane Smith"/><br />
        <sub><b>Ankit Raj</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/Abhi-11-sirius">
        <img src="https://github.com/Abhi-11-sirius.png" width="100px;" alt="Chris Lee"/><br />
        <sub><b>Abhishek Kumar Yadav</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/Aryan14021974">
        <img src="https://github.com/Aryan14021974.png" width="100px;" alt="Alex Kim"/><br />
        <sub><b>Aryan Kesharwani</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/ShaanKapoor10">
        <img src="https://github.com/ShaanKapoor10.png" width="100px;" alt="Alex Kim"/><br />
        <sub><b>Shaan Kapoor</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/Anu17shka">
        <img src="https://github.com/Anu17shka.png" width="100px;" alt="Alex Kim"/><br />
        <sub><b>Anuskha Goyal</b></sub>
      </a>
    </td>
  </tr>
</table>

If you'd like to contribute, please feel free to open an issue or submit a pull request!

