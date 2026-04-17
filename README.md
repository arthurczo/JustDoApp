# JustDoApp - Task Management System

## 📌 Overview
JustDoApp is a task management system (To-Do List) designed to help users organize daily activities. The project focuses on data modeling, persistence, and integration between front-end and back-end systems.

## 🧠 Data Engineering Perspective
This project emphasizes:
- NoSQL data modeling using MongoDB
- Data relationships between users and tasks
- CRUD operations with persistent storage
- API-driven data communication

## 🏗️ Architecture
- Backend: Java + Spring Boot (REST API)
- Frontend: React + Next.js + TypeScript
- Database: MongoDB

## 🗃️ Data Modeling
Collections:
- **users**
  - id
  - username
  - password (hashed)

- **tasks**
  - id
  - title
  - description
  - completed
  - userId (reference)

The system ensures:
- Data consistency between collections
- Efficient querying for user-specific tasks

## 🔄 Data Flow
1. User creates or updates tasks via frontend
2. API processes requests and applies business logic
3. Data is stored in MongoDB
4. Frontend retrieves updated data via API

## ⚙️ Technologies
- Java
- Spring Boot
- MongoDB
- React / Next.js
- TypeScript

## 📊 Key Features
- Task creation, update, deletion
- User authentication
- Data persistence and retrieval
- RESTful API communication

## 🚀 Future Improvements
- Data indexing for performance optimization
- Analytics dashboard for user productivity
- Data pipeline integration for insights

## 🔗 Repository
[Access the project here] https://github.com/arthurczo/JustDoApp.git