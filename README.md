# Product Management API and User Interface

## 1. Project Overview
This repository contains a fully functional web application developed using Node.js, Express, and MongoDB. The application follows the Model-View-Controller (MVC) architectural pattern, providing both a RESTful API for programmatic access and a server-side rendered User Interface for end-user interaction. 

A critical resilience feature engineered into this application is the In-Memory Fallback Mechanism. During the initialization sequence, the server attempts to establish a connection to the primary MongoDB instance with a configured 3-second timeout. If the database is unreachable, the application automatically fails over to an internal in-memory datastore, guaranteeing zero application downtime.

## 2. Technology Stack
* Backend Framework: Node.js runtime environment utilizing the Express.js framework.
* Database: MongoDB with integrated in-memory fallback.
* Frontend Rendering: Embedded JavaScript (EJS) templating engine.
* File Management: Multer middleware for handling multipart/form-data.

## 3. Local Environment Setup

1. Install required dependencies:
   npm install

2. Environment Configuration:
   Duplicate the provided environment template to create your local configuration file.
   cp .env.example .env

3. Execute the application:
   npm start