# Vinsync

Vinsync is a Chrome extension designed to synchronize video playback across multiple users in real-time. It leverages WebSockets for real-time communication and supports features like video playback control, room creation, and joining, as well as video state management.

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Development](#development)

## Features

- **Real-time synchronization**: Synchronize video playback (play, pause, seek) across multiple users.
- **Room management**: Create and join rooms to watch videos together.
- **Video state management**: Track and update video playback state (playing, paused, buffering, current time, playback rate).

![Home Screenshot](https://i.ibb.co/HxZncPw/image.png) ![Room Screenshot](https://i.ibb.co/z8WZrjq/image.png)
![After video Selection](https://i.ibb.co/tP3F1F4/image.png)

## Project Structure


![Basic Structure](https://i.ibb.co/tCt6t0h/project-Architecture.png)

The Vinsync project is organized into three main packages: `backend`, `extension`, and `types`.
### Backend

The backend is built with Socket.IO and Express, and it uses TypeScript for type safety. It handles real-time communication and room management.

- **Directory**: `backend`
- **Main Scripts**:
  - **Build**: Compiles TypeScript files.
    ```json
    "build": "tsc"
    ```
  - **Start**: Starts the server using Nodemon for automatic restarts during development.
    ```json
    "start": "nodemon"
    ```
- **Environment Configuration**: `.env` file
  ```env
  NODE_ENV=development
  PORT=3000
  ```

### Frontend (Extension)

The frontend, named `extension`, is built with Vite, React, and Socket.IO-client. It also uses Lucide icons for UI elements. The extension's source code and configuration ensure that it compiles into the `dist` folder, which acts as the final extension directory.

- **Directory**: `extension`
- **Main Scripts**:
  - **Development**: Watches for file changes and rebuilds automatically.
    ```json
    "dev": "vite build --watch"
    ```
  - **Build**: Compiles TypeScript and Vite files.
    ```json
    "build": "tsc -b && vite build"
    ```
- **Extension Structure**:
  - **Manifest File**: Located in the `public` folder.
  - **Extension Scripts**: `background.js` and `content.js` are located in `extension/src/extension-scripts`.
  - **Build Output**: The entire code compiles and outputs to the `dist` folder. Select this folder in Chrome to use the extension.

### Types

The `types` package serves as a central point for defining types shared by both the backend and frontend. This ensures type consistency across the project.

- **Directory**: `types`
- **Type Copy Script**: Copies types to the `src` folder of both `backend` and `extension` during the build process.
  ```json
  "build-types": "node copy-types.js"
  ```
- **Note**: Whenever types are changed by the developer, `build-types` should be executed to ensure the latest types are used across the project.

- **Types Structure**:
  - **Copy Script**: `types/copy-types.js`

### Development

To set up the Vinsync project for development, follow the steps below for each part of the project: backend, frontend (extension), and types.

#### Prerequisites

- Node.js (v14.x or higher)
- npm or yarn
- Chrome (for testing the extension)

#### Setting Up the Project

1. **Clone the Repository**

   ```sh
   git clone https://github.com/anaysah/vinsync.git
   cd vinsync
   ```

2. **Install Dependencies**

   Install the dependencies for each package:

   ```sh
   # Install dependencies for backend
   cd backend
   npm install
   cd ..

   # Install dependencies for extension
   cd extension
   npm install
   cd ..

   # Install dependencies for types
   cd types
   npm install
   cd ..
   ```

3. **Build the Types Package**

   Whenever you make changes to the types in the `types` package, you should run the `build-types` script to ensure the latest types are used across both the backend and extension.

   ```sh
   cd types
   npm run build-types
   cd ..
   ```

4. **Running the Backend**

   To start the backend server with live reloading:

   ```sh
   cd backend
   npm run build
   npm start
   ```

   The server will be available at `http://localhost:3000`.

5. **Running the Frontend (Extension)**

   To start the frontend development server with live reloading:

   ```sh
   cd extension
   npm run dev
   ```

   Vite will watch for changes and rebuild the project automatically.

6. **Loading the Extension in Chrome**

   - Open Chrome and navigate to `chrome://extensions/`.
   - Enable "Developer mode" using the toggle in the top right.
   - Click "Load unpacked" and select the `dist` folder inside the `extension` directory.

   Chrome will load the extension and you can start testing its features.

#### Development Workflow

1. **Backend Development**

   - Modify backend source code in the `backend/src` directory.
   - The server will restart automatically upon detecting changes (thanks to Nodemon).

2. **Frontend Development**

   - Modify frontend (extension) source code in the `extension/src` directory.
   - Vite will automatically rebuild and reload the extension.

3. **Types Development**

   - Modify shared types in the `types/src` directory.
   - Run the `build-types` script to copy the updated types to both the backend and extension:
     ```sh
     cd types
     npm run build-types
     cd ..
     ```

4. **Testing and Debugging**

   - Use Chrome DevTools to debug and test the extension.
   - Monitor the backend logs for any issues or debug messages.