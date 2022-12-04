import { useContext } from 'react';
import './Task.css';

import { RiDeleteBinLine } from 'react-icons/ri';

import { AuthContext } from '../context/AuthContext';

const Task = ({ task, todoId, getTodos }) => {
  const { user } = useContext(AuthContext);
  //Delete task
  const deleteTask = async (task, e) => {
    e.preventDefault();
    const response = await fetch(
      `http://localhost:5000/api/v1/task/${todoId}/delete/`,
      {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task: task,
          appwriteId: user.userId,
        }),
      }
    );
    //   const json = await response.json();
    if (response.ok) {
      getTodos();
    }
  };

  return (
    <div className="task-item">
      <span>{task}</span>
      <span className="task-operations">
        <RiDeleteBinLine
          className="delete-task-icon"
          onClick={(e) => deleteTask(task, e)}
        />
      </span>
    </div>
  );
};

export default Task;
