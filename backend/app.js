require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectToDB = require('./config/db');
const todoRoutes = require('./routes/todoRoutes');
const taskTodoRoutes = require('./routes/taskTodoRoutes');
const userRoutes = require('./routes/userRoutes');
const app = express();

//Middlwares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

var corsOptions = {
  origin: 'http://localhost:3000',
};

app.use(cors(corsOptions));

//connect database
connectToDB();

app.use('/api/v1', todoRoutes);
app.use('/api/v1/task', taskTodoRoutes);
app.use('/api/v1/user', userRoutes);

module.exports = app;
