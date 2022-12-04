import { createContext, useReducer } from 'react';

export const TodoContext = createContext();

export const todoReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_TODOS':
      return { todos: action.payload };
    default:
      return state;
  }
};

export const TodoContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(todoReducer, {
    user: [],
  });

  console.log('TodoContext state:', state);

  return (
    <TodoContext.Provider value={{ ...state, dispatch }}>
      {children}
    </TodoContext.Provider>
  );
};
