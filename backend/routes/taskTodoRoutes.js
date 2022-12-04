const {
  createTaskTodo,
  deleteTaskTodo,
} = require('../controllers/taskTodoController');

const router = require('express').Router();

//Create tasks under the todo (User should only be able to add task to their own todo)
/*
API ENDPOINT: http://localhost:5000/api/v1/task/638a4f16b2dab59007dae20f/create
body
{
    "task":"python",
    "appwriteid":"XXXXXXXXXXX"
}
*/
router.post('/:todoId/create/', createTaskTodo);

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
router.delete('/:todoId/delete/', deleteTaskTodo);

module.exports = router;
