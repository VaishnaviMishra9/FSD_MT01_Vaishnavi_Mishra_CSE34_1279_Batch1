# FSD_MT01_Vaishnavi_Mishra_CSE34_1279_Batch1

## Student Record Management API (Set B)

REST API built with Node.js and Express.js. Data is stored in an in-memory JavaScript array (no database).

Setup and Run
bash
npm install
node server.js

Server runs on http://localhost:3000

Endpoints
Method	Endpoint	Description
GET	/api/students	Get all students (200)
POST	/api/students	Add a student (201 / 400)
GET	/api/students/:id	Get student by id (200 / 404)
PUT	/api/students/:id	Update a student (200 / 400 / 404)
DELETE	/api/students/:id	Delete a student (200 / 404)
GET	/api/students/filter?branch=CSE	Filter by branch, case-insensitive (200)
Sample POST body
json
{
  "rollNumber": "IT2404",
  "name": "Meera Gupta",
  "branch": "IT",
  "semester": 3,
  "email": "meera@example.com"
}
Testing

All endpoints tested using Postman / Thunder Client. Screenshots are in the screenshots/ folder.
# FSD_MT01_Vaishnavi_Mishra_CSE34_1279_Batch1