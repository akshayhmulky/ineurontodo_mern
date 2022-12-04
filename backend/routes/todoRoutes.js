const {
  createTodo,
  editTodo,
  deleteTodo,
  getAllTodo,
  getTodo,
  searchTodo,
} = require('../controllers/todoController');

const router = require('express').Router();

//Create todo
/*
 API ENDPOINT: http://localhost:5000/api/v1/create/

 body{
    "title":"MERN STACK",
    "appwriteId":"XXXXXXXXXXXXX"
 }
 */
router.post('/create/', createTodo);

//========================================================================================================================

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
router.post('/', getAllTodo);

//======================================================================================================================

//Search todo by title
/*
API ENDPOINT: http://localhost:5000/api/v1/search/
body:
{
    "searchTitle":"Lang"
}
*/
router.post('/search/', searchTodo);

//=======================================================================================================================

//Get todo by id
/*
API ENDPOINT: http://localhost:5000/api/v1/638a44bd9a5aa7c64d792bf5
*/
router.get('/:todoId', getTodo);

//=======================================================================================================================

//Edit todo by id (Only owner should be able edit it)
/*
API ENDPOINT: http://localhost:5000/api/v1/edit/638b71189328cdecf320b91c
body:
{
    "title":"DJANGO Update",
    "appwriteId": "XXXXXXXXXXXXX"
}
*/

router.patch('/edit/:todoId', editTodo);

//=======================================================================================================================

//Delete todo created by self
/*
API ENDPOINT: http://localhost:5000/api/v1/delete/638a44bd9a5aa7c64d792bf5
body:
{
    "appwriteId":"55555555555555"
}
*/

router.delete('/delete/:todoId', deleteTodo);

module.exports = router;
