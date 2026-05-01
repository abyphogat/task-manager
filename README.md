# Team Task Manager

A full-stack web application built with the MERN stack (MongoDB, Express, React, Node.js) for managing projects and tracking team tasks. 

## Features

- **Role-Based Access Control:** Differentiates between 'Admin' and 'Member' roles.
  - **Admins** can create projects, assign users to projects, create tasks, and manage the full workflow.
  - **Members** can view their assigned projects, view their tasks, and update task statuses.
- **Project Management:** Create projects with descriptions and view all active projects.
- **Task Tracking:** Kanban-style or list-based tracking of tasks (To Do, In Progress, Done).
- **Dashboard:** At-a-glance overview of statistics, total tasks, and overdue items.
- **Premium UI:** Built with Tailwind CSS and Lucide React icons for a responsive, clean, and modern look.

## Technologies Used

- **Frontend:** React (Vite), Tailwind CSS, React Router DOM, Axios
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Authentication:** JSON Web Tokens (JWT), bcryptjs

## Local Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd team-task-manager
   ```

2. **Install all dependencies:**
   From the root of the project, run:
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Navigate to the `server` folder and rename/create a `.env` file:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

4. **Start the Development Servers:**
   You will need two terminal windows.
   - Terminal 1 (Backend):
     ```bash
     cd server
     npm run dev
     ```
   - Terminal 2 (Frontend):
     ```bash
     cd client
     npm run dev
     ```

## Deployment on Railway

This project is configured as a Monorepo for easy deployment on Railway.

1. Connect your GitHub repository to Railway.
2. Railway will automatically detect the root `package.json`.
3. Add your Environment Variables in Railway (`MONGO_URI`, `JWT_SECRET`, `NODE_ENV=production`).
4. Railway will run `npm install`, then `npm run build`, and finally `npm start` to serve both the Node API and the static React frontend from the same server.
