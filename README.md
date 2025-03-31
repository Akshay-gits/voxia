# Voxia

Voxia is a MERN stack application that integrates **Clerk** for authentication and **Gemini API** for AI-powered features. The project provides a seamless user experience.

## Features

- **User Authentication**: Clerk-powered sign-in, sign-up, and session management.
- **Gemini API Integration**: AI-powered functionalities.
- **Frontend**: React-based UI with Tailwind CSS.
- **Backend**: Express.js and MongoDB for API and database.

## Tech Stack

- **Frontend**: React, Clerk, Tailwind CSS
- **Backend**: Node.js, Express.js, MongoDB
- **Authentication**: Clerk
- **AI Integration**: Gemini API
- **Deployment**: (To be updated once hosted)

## Installation & Setup

### Prerequisites

- Node.js & npm installed
- MongoDB Atlas account
- Clerk account with API keys
- Gemini API access

### Clone the Repository

```sh
git clone https://github.com/YOUR_GITHUB_USERNAME/voxia.git
cd voxia
```

### Backend Setup

```sh
cd server
npm install
```

Create a `.env` file in the **server** directory:

```env
MONGODB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/your_db_name?retryWrites=true&w=majority
CLERK_SECRET_KEY=your_clerk_secret_key
GEMINI_API_KEY=your_gemini_api_key
PORT=5000
```

Start the backend server:

```sh
npm start
```

### Frontend Setup

```sh
cd ../client
npm install
```

Create a `.env` file in the **client** directory:

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_GEMINI_API_KEY=your_gemini_api_key
```

Start the frontend server:

```sh
npm run dev
```

## Usage

Once both frontend and backend are running:

- Open `http://localhost:5173` to access the app.
- Sign in using Clerk authentication.
- Explore AI-powered features integrated with the Gemini API.

## Deployment (To be updated)

- Backend: (Will be deployed on **Render/Vercel/Railway**)
- Frontend: (Will be deployed on **Vercel/Netlify/GitHub Pages**)
- Domain Name: (Will be configured with GitHub Student Developer Pack)

## Contributing

Feel free to submit issues or pull requests if you'd like to contribute!

## License

This project is open-source under the MIT License.

---

### Author

**Akshay M**

🚀 Happy coding!

