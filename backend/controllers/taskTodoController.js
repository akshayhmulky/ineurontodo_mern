const Todo = require('../models/todoModel');
const User = require('../models/userModel');
const mongoose = require('mongoose');

//Create tasks under the todo (User should only be able to add task to their own todo)
/*
API ENDPOINT: http://localhost:5000/api/v1/task/638a4f16b2dab59007dae20f/create
body
{
    "task":"python",
    "appwriteid":"XXXXXXXXXXX"
}
*/
exports.createTaskTodo = async (req, res) => {
  try {
    const { todoId } = req.params;
    const { task, appwriteId } = req.body;

    //Check if todoId is passed or not
    if (!todoId) {
      return res.status(400).json({ error: 'Please pass todoId' });
    }

    //Check if blank task
    if (!task) {
      return res.status(400).json({ error: 'task cannot be blank' });
    }

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
      //Push task into tasks field of a Todo
      /*
      Handle Duplication
      NOTE: If user is trying to add same tasks multiple times, then we are ignoring it
      */
      if (!todo.tasks.includes(task)) {
        todo.tasks.push(task);
        todo.save();
      }
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

//=============================================================================================================================

//Delete task from a Todo( User should only be able to delete task from their own todo)
/*
API ENDPOINT: http://localhost:5000/api/v1/task/638a4f16b2dab59007dae20f/delete/
body
{
  "task":"python",
  "appwriteId":"XXXXXXXXXXXXXX"
}
*/
exports.deleteTaskTodo = async (req, res) => {
  try {
    const { todoId } = req.params;
    const { task, appwriteId } = req.body;

    //Check if todoId is passed or not
    if (!todoId) {
      return res.status(400).json({ error: 'Please pass todoId' });
    }

    //Check if blank task
    if (!task) {
      return res.status(400).json({ error: 'task cannot be blank' });
    }

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
    //use case: if user tries to delete same id which was already deleted
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found by given id' });
    }

    //Checking if loggedin user is owner of this todo, if not then throw an error message
    if (todo.user.equals(user[0]?._id)) {
      //Check if task which you're trying to delete is present in the tasks array field
      if (todo.tasks.includes(task)) {
        //Filter tasks field of a Todo to remove passed task, and then add filteredTask back to tasks field of a Todo
        filteredTasks = todo.tasks.filter((t) => t !== task);
        todo.tasks = [...filteredTasks];
        todo.save();
        return res.status(200).json({
          success: true,
          message: 'task has been deleted successfully',
          todo,
        });
      } else {
        return res.status(200).json({
          success: false,
          message: 'No tasks found',
        });
      }
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
