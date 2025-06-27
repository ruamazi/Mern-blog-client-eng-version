# MERN Blog Client

This is the frontend for the MERN Blog application. It's built with React, Vite, and Tailwind CSS.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

* Node.js
* npm

### Installing

1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/your-client-repo.git
   ```
2. Install the dependencies:
   ```sh
   npm install
   ```
4. Create a `.env` file and add the following environment variables:
   ```
   VITE_API_URL=http://localhost:5000
   ```
5. Start the development server:
   ```sh
   npm run dev
   ```

## Features

### Core Features

*   **User Authentication:** Users can register, log in, and log out. They can also request a password reset and verify their email address.
*   **Blog Management:** Users can create, read, update, and delete their own blog posts. They can also make their blogs public or private.
*   **Commenting:** Users can comment on blog posts.
*   **Liking and Disliking:** Users can like and dislike blog posts.
*   **Tagging:** Users can add tags to their blog posts, and other users can find blogs by tag.
*   **User Profiles:** Users have a profile page where they can see their own blogs and statistics.
*   **Following:** Users can follow and unfollow other users.
*   **Favorites:** Users can add blogs to their favorites list.
*   **Contact Form:** Users can contact the website administrators through a contact form.

### Admin Features

*   **Dashboard:** Admins have a dashboard with statistics about the website.
*   **User Management:** Admins can manage users, including changing their roles and banning them.
*   **Blog Management:** Admins can manage all blogs, including approving them and changing their status.
*   **Website Settings:** Admins can change the website's name, logo, and other settings.
*   **Color Scheme:** Admins can customize the website's color scheme.

## Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs the app in the development mode.

### `npm run build`

Builds the app for production to the `dist` folder.

### `npm run lint`

Lints the project files.

### `npm run preview`

Serves the production build locally.

## Dependencies

* **@tiptap/react:** A headless WYSIWYG text editor framework for React.
* **axios:** Promise based HTTP client for the browser and node.js
* **dompurify:** A DOM-only, super-fast, uber-tolerant XSS sanitizer for HTML, MathML and SVG.
* **hls.js:** A JavaScript library that implements an HTTP Live Streaming client.
* **react:** A JavaScript library for building user interfaces.
* **react-dom:** Serves as the entry point to the DOM and server renderers for React.
* **react-icons:** A collection of popular icons for React projects.
* **react-router-dom:** DOM bindings for React Router.
* **tailwindcss:** A utility-first CSS framework for rapidly building custom designs.

## Dev Dependencies

* **@vitejs/plugin-react:** The official Vite plugin for React.
* **eslint:** A tool for identifying and reporting on patterns found in ECMAScript/JavaScript code.
* **vite:** A build tool that aims to provide a faster and leaner development experience for modern web projects.