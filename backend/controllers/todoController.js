const Todo = require('../models/todoModel');
const User = require('../models/userModel');
const mongoose = require('mongoose');

//Create todo
/*
 API ENDPOINT: http://localhost:5000/api/v1/create/

 body{
    "title":"MERN STACK",
    "appwriteId":"XXXXXXXXXXXXX"
 }
 */
exports.createTodo = async (req, res) => {
  try {
    const { title, appwriteId } = req.body;

    //Check if appwriteId has been passed, if not then throw an error message
    if (!appwriteId) {
      return res.status(400).json({ error: 'Appwrite Id is required' });
    }

    //Try to fetch user from appwriteId
    const user = await User.find({ appwriteId }).select('_id');
    //If user is not found then, throw an error message stating user is not authoized to perform creation ntask
    if (user.length === 0) {
      res.status(401).json({
        success: false,
        message: 'Request is not authorized',
      });
    }

    //Title cannot be blank
    if (!title) {
      return res.status(400).json({
        error: 'Title cannot be blank',
      });
    }

    //Create todo
    const createdTodo = await Todo.create({
      title: title,
      user: user[0]._id,
    });

    res.status(201).json({
      success: true,
      message: 'todo created successfully',
      createdTodo,
    });
    res.send(title);
  } catch (error) {
    res.status(500).json({
      error: 'Sorry, something wen wrong :/',
    });
  }
};

//=======================================================================================================================

//Get all todos (Users should be able to see only their todos)
/*
Sort by
    -createdAT : ASCEDNING OR DESCENDING
    -updatedAt : ASCENDING OR DESCENDING
    
API ENDPOINT: http://localhost:5000/api/v1/    
body:
    {
        "sortBy":"updatedAt",
        "sortOrder": -1,
        "appwriteId":"XXXXXXXXXXXX"

    }
*/
exports.getAllTodo = async (req, res) => {
  try {
    /*Below sorting logic can not only sort by createdAt or updatedAt as per assignment, 
    But also by all other options like isCompleted, title, etc
    */
    const sorting = {};

    //If sortBy filter is not provided then by default sort by createdAt field
    const sortBy = req.body.sortBy || 'createdAt';

    //If sortOrder filter is not provided then by default sort in DESCENDING order
    const sortOrder = req.body.sortOrder || -1;

    sorting[sortBy] = sortOrder;

    console.log(sorting);

    const { appwriteId } = req.body;

    //Check if appwriteId is provided or not, if not throw an error
    if (!appwriteId) {
      return res.status(400).json({
        error: 'Please pass appwriteId',
      });
    }

    //Find user with appwriteId
    const user = await User.find({ appwriteId }).select('_id');

    //By default sort by createdAt
    const todos = await Todo.find({ user }).sort(sorting);

    //If we are unable to find any todo by given user
    if (todos.length === 0) {
      return res.status(404).json({ error: 'User does not have todo' });
    }

    res.status(200).json({
      success: true,
      todos,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//=======================================================================================================================

//Get todo by id (Can also pass appwriteId for extra layer of security)
/*
API ENDPOINT: http://localhost:5000/api/v1/638a44bd9a5aa7c64d792bf5
*/
exports.getTodo = async (req, res) => {
  try {
    const { todoId } = req.params;

    //Check if todoId is provided or not
    if (!todoId) {
      return res.status(400).json({
        error: 'Please pass todoId',
      });
    }

    //Check if provided todoId is valid or not
    if (!mongoose.Types.ObjectId.isValid(todoId)) {
      return res.status(404).json({
        error: 'Invalid todoId',
      });
    }

    //Find todo
    const todo = await Todo.findById(todoId);

    //If we are unable to find any todo by given id then output below message
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found by given id' });
    }

    res.status(200).json({
      success: true,
      todo,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//=========================================================================================================================

//Edit todo by id (Only owner should be able to edit it)
/*
API ENDPOINT: http://localhost:5000/api/v1/edit/638b71189328cdecf320b91c
body:
{
    "title":"DJANGO Update",
    "appwriteId": "XXXXXXXXXXXXX"
}

body:
{
    "isCompleted":true,
    "appwriteId": "XXXXXXXXXXXXX"
}
*/
exports.editTodo = async (req, res) => {
  try {
    const { todoId } = req.params;
    const { title, isCompleted, appwriteId } = req.body;
    console.log('WHO IS COMING', todoId, isCompleted, appwriteId);

    //Check if todoId is provided or not
    if (!todoId) {
      return res.status(400).json({
        error: 'Please pass todoId for updation request',
      });
    }

    //Check if provided todoId is valid or not
    if (!mongoose.Types.ObjectId.isValid(todoId)) {
      return res.status(404).json({
        error: 'Invalid todoId',
      });
    }

    //If title is blank
    if (title === '') {
      return res.status(400).json({
        error: 'Title cannot be blank',
      });
    }

    //Check if user has passed appwriteId if not then throw an error message
    if (!appwriteId) {
      return res.status(400).json({
        error: 'appwriteId cannot be blank',
      });
    }

    //find user by appwriteId
    const user = await User.find({ appwriteId }).select('_id');

    //Find todo by todoId
    const todo = await Todo.findById(todoId);

    //If we are unable to find any todo by given id then output below message
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found by given id' });
    }

    //Checking if loggedin user is owner of this todo, if not then throw an error message
    if (todo.user.equals(user[0]?._id)) {
      title && (todo.title = title);
      isCompleted && (todo.isCompleted = isCompleted);
      todo.save();
      return res.status(200).json({
        success: true,
        message: todo,
      });
    } else {
      return res.status(401).json({
        error: 'You can only edit your todo',
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//========================================================================================================================

//Deleting todo by id (Only owner should be able to delete it)
/*
API ENDPOINT: http://localhost:5000/api/v1/delete/638a44bd9a5aa7c64d792bf5
body:
{
    "appwriteId":"55555555555555"
}
*/
exports.deleteTodo = async (req, res) => {
  try {
    const { todoId } = req.params;

    const { appwriteId } = req.body;

    //Check if provided todoId is valid or not
    if (!mongoose.Types.ObjectId.isValid(todoId)) {
      return res.status(404).json({
        error: 'Invalid todoId',
      });
    }

    //Check if user has passed appwriteId if not then throw an error message
    if (!appwriteId) {
      return res.status(400).json({
        error: 'appwriteId cannot be blank',
      });
    }

    //find user by appwriteId
    const user = await User.find({ appwriteId }).select('_id');

    //Find todo by id
    const todo = await Todo.findById(todoId);

    //If we are unable to find any todo by given id then output below message
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found by given id' });
    }

    //Checking if loggedin user is owner of this todo, if not then throw an error message
    if (todo.user.equals(user[0]?._id)) {
      //Delete todo
      todo.delete();
      return res.status(200).json({
        success: true,
        message: 'todo has been deleted successfully',
      });
    } else {
      return res.status(401).json({
        error: 'You can only edit your todo',
      });
    }
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

//=========================================================================================================================

//Search todo by title (Users should be able to search only their todos)
/*
API ENDPOINT: http://localhost:5000/api/v1/search/
body:
{
    "searchTitle":"Lang"
}
*/
exports.searchTodo = async (req, res) => {
  try {
    const { searchTitle, appwriteId } = req.body;
    console.log(searchTitle);

    //Check if user has passed appwriteId if not then throw an error message
    if (!appwriteId) {
      return res.status(400).json({
        error: 'appwriteId cannot be blank',
      });
    }

    //find user by appwriteId
    const user = await User.find({ appwriteId }).select('_id');

    //Find todo by title (handle partial search and case sensitivity)
    const todos = await Todo.find({
      title: {
        $regex: searchTitle,
        $options: 'i',
      },
      user: user,
    });

    // console.log('Search return', todos);

    //If searchtitle does not match any todo, then return message as No todo found.
    if (todos.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No todo found',
      });
    }

    res.status(200).json({
      success: true,
      todos,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
