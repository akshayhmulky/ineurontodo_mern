import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { TodoContext } from '../context/todoContext';
import Todo from '../components/Todo';
import './Home.css';

import { Navigate } from 'react-router-dom';

import { BsSquareFill } from 'react-icons/bs';

export const Home = () => {
  const { user } = useContext(AuthContext);
  const { todos, dispatch } = useContext(TodoContext);
  const [searchText, setSearchText] = useState('');
  // const [todos, setTodos] = useState([]);

  const getTodos = async (sortTodo) => {
    let sortO = sortTodo ? sortTodo.split(' ')[1] : -1;
    let sortBy = sortTodo ? sortTodo.split(' ')[0] : 'createdAt';
    try {
      // console.log('WHAT FILTER IS SELECTED', sortOrder);
      const response = await fetch('http://localhost:5000/api/v1/ ', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sortBy: sortBy,
          sortOrder: sortO,
          appwriteId: user.userId,
        }),
      });
      const json = await response.json();
      dispatch({ type: 'FETCH_TODOS', payload: json.todos });
      // setTodos(json.todos);
    } catch (error) {
      console.log('Something went wrong', error.message);
    }
  };

  const createTodo = async (e) => {
    e.preventDefault();
    const toBeAddedTodo = prompt('Create Todo');
    if (toBeAddedTodo) {
      const response = await fetch(`http://localhost:5000/api/v1/create/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appwriteId: user && user.userId,
          title: toBeAddedTodo,
        }),
      });
      //   const json = await response.json();
      if (response.ok) {
        getTodos();
      }
    }
  };

  const onSearchSubmit = async () => {
    // console.log('WHAT SERACH IS PASSED', searchText);
    const response = await fetch('http://localhost:5000/api/v1/search/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        appwriteId: user.userId,
        searchTitle: searchText,
      }),
    });
    const json = await response.json();
    if (response.ok) {
      console.log('What did i get back from serach api', json.todos);
      dispatch({ type: 'FETCH_TODOS', payload: json.todos });
    }
  };

  //Real time seraching testing
  useEffect(() => {
    if (searchText.length > 0) {
      onSearchSubmit();
    } else {
      getTodos();
    }
  }, [searchText]);

  // useEffect(() => {
  //   getTodos();
  // }, []);

  if (!user) {
    return <Navigate replace to="/login" />;
  }

  return (
    <>
      <div className="container">
        <div className="todo-container">
          <div className="info-header">
            <div>
              <button
                className="add-todo-button"
                onClick={(e) => createTodo(e)}
              >
                Add Todo
              </button>
            </div>
            <div>
              <span className="info-item-1">
                <BsSquareFill className="violet-todo" />
                Todo
              </span>{' '}
              <span className="info-item-2">
                <BsSquareFill className="teal-task" />
                Task
              </span>
            </div>
          </div>
          <div>
            <form>
              <input
                type="search"
                name="search"
                id="search"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search todo..."
                className="search-input"
              />
            </form>
          </div>
          <div className="sorting-todo">
            <select name="" onChange={(e) => getTodos(e.target.value)}>
              <option value="createdAt -1">Sort Newest to Oldest</option>
              <option value="createdAt 1">Sort Oldest to Newest</option>
              <option value="isCompleted -1">Sort by Completed Todo</option>
            </select>
          </div>
          {todos ? (
            <div>
              {todos.map((todo) => (
                <Todo key={todo._id} todo={todo} getTodos={getTodos} />
              ))}
            </div>
          ) : (
            <div className="no-todo-message">
              You have not created any Todos yet :(
            </div>
          )}
        </div>
      </div>
    </>
  );
};
