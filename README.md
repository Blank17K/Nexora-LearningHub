# Nexora

> This is an online learning platform. Like Udemy, Skill Share etc.

**Author:** Trump Alliance  
**Version:** 1.0.0  
**License:** ISC  

## 🚀 Tech Stack

- **Frontend:** React, React Router, Bootstrap
- **Backend:** Node.js, Express
- **Build Tools:** Webpack, Babel

## 🛠️ Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- npm (Node Package Manager)

## 📦 Installation

1. Clone the repository or download the source code.
2. Open a terminal and navigate to the root directory of the project.
3. Install the dependencies by running:
   ```bash
   npm install
   ```

## 🏃‍♂️ Scripts & Usage

This project includes several npm scripts to help you develop and run the application.

### Start the Application (Build & Run)
To compile the frontend/backend code and start the Express server, run:
```bash
npm start
```
*Behind the scenes: This runs Webpack to bundle your client-side code, uses Babel to compile `server.js` into the `dist` directory, and then executes `node dist/server.js`.*

### Development Watch Mode
If you are modifying frontend files and want Webpack to automatically recompile your bundles on save, open a separate terminal and run:
```bash
npm run watch
```

### Manual Build
To just build the production assets without starting the server, run:
```bash
npm run build
```

## ⚙️ Configuration Notes

- **Entry File:** The main entry point for the backend server is expected to be `server.js`.
- **Output Directory:** The build process will output the compiled server and frontend bundles into a `dist/` directory.
