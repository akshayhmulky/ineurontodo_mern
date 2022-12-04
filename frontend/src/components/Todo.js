import { useContext } from 'react';
import Task from './Task';
import './Todo.css';

import { format } from 'timeago.js';

import { AuthContext } from '../context/AuthContext';

const Todo = ({ todo, getTodos }) => {
  const { user } = useContext(AuthContext);

  const deleteTodo = async (todoId, e) => {
    e.preventDefault();
    const response = await fetch(
      `http://localhost:5000/api/v1/delete/${todoId}`,
      {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appwriteId: user.userId,
        }),
      }
    );
    //   const json = await response.json();
    if (response.ok) {
      getTodos();
    }
  };

  const editTodo = async (todoId, e) => {
    e.preventDefault();
    const toBeEditedTodo = prompt('Enter new Todo name');
    console.log('todo edit', toBeEditedTodo, todoId);
    if (toBeEditedTodo) {
      const response = await fetch(
        `http://localhost:5000/api/v1/edit/${todoId}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            appwriteId: user.userId,
            title: toBeEditedTodo,
          }),
        }
      );
      //   const json = await response.json();
      if (response.ok) {
        getTodos();
      }
    }
  };

  const markTodoComplete = async (todoId, e) => {
    e.preventDefault();
    const response = await fetch(
      `http://localhost:5000/api/v1/edit/${todoId}`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appwriteId: user.userId,
          isCompleted: true,
        }),
      }
    );
    //   const json = await response.json();
    if (response.ok) {
      getTodos();
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    const toBeAddedTask = prompt('Add Task');
    if (toBeAddedTask) {
      const response = await fetch(
        `http://localhost:5000/api/v1/task/${todo._id}/create`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            task: toBeAddedTask,
            appwriteId: user.userId,
          }),
        }
      );
      //   const json = await response.json();
      if (response.ok) {
        getTodos();
      }
    }
  };

  return (
    <div className="todo-list">
      {todo.isCompleted && (
        <div className="todo-completed-overlay">Completed</div>
      )}
      <div className="todo-title">
        {/* <div className="todo-header">Todo:</div> */}

        <div className="todo-item">{todo.title}</div>
        <div className="todo-createdtime">{format(todo.createdAt)}</div>
        <div className="edit-icon" onClick={(e) => editTodo(todo._id, e)}>
          Edit
        </div>
        <div className="delete-icon" onClick={(e) => deleteTodo(todo._id, e)}>
          Delete
        </div>
        <div
          className="markcomplete-icon"
          onClick={(e) => {
            markTodoComplete(todo._id, e);
          }}
        >
          Mark complete
        </div>
      </div>
      <div className="task-list">
        <div className="add-task-container">
          <button className="add-task-button" onClick={(e) => addTask(e)}>
            Add Task
          </button>
        </div>
        {todo.tasks.length > 0 ? (
          <div className="task-title">
            {todo.tasks.map((task, index) => (
              <Task
                key={index}
                task={task}
                todoId={todo._id}
                getTodos={getTodos}
              />
            ))}
          </div>
        ) : (
          <div className="no-task">No Task :)</div>
        )}
      </div>
    </div>
  );
};

export default Todo;
