# Video Playlist Maker (Full Stack)

A comprehensive full-stack application for managing video playlists, tracking engagement (likes/dislikes), and participating in real-time discussions.

## Project Structure

The project is organized into two main components:

### [Frontend](./frontend)
- **Technology:** React (Vite)
- **Features:**
  - Modern, component-based UI.
  - Integration with the Spring Boot API.
  - Interactive video player and live chat interface.
  - Responsive design for various screen sizes.

### [Backend](./backend)
- **Technology:** Java, Spring Boot
- **Features:**
  - RESTful API for managing playlists, videos, and comments.
  - Data persistence (H2/MySQL as configured in `application.properties`).
  - Controllers for handling complex business logic.
  - Entity-relationship mapping for Playlists, Videos, and Comments.

## Branch Versions

- **`main` Branch:** Features the full-stack version with **React** frontend and **Spring Boot** backend.
- **`plain` Branch:** Features a standalone **Vanilla JavaScript** version of the frontend (ideal for learning DOM manipulation).

## Getting Started

### Prerequisites
- Node.js & npm (for Frontend)
- JDK 17+ & Maven (for Backend)

### Running the Backend
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Run the Spring Boot application:
   ```bash
   ./mvnw spring-boot:run
   ```

### Running the Frontend
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints
- `GET /api/playlists`: Fetch all playlists.
- `POST /api/playlists`: Create a new playlist.
- `GET /api/videos/{id}`: Get video details.
- `PATCH /api/videos/{id}/like`: Like a video.
- ... and more (see controllers for details).
