import { createContext, useEffect, useReducer } from 'react';

export const AuthContext = createContext();

export const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { user: action.payload };
    case 'LOAD_INITIAL_USER':
      return { user: action.payload };
    case 'LOGOUT':
      return { user: null };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  //   const initialState =

  //Fetch initial user state using AppWrite function.
  //   const fetchUser = async () => {
  //     try {
  //       const userData = await getUser();
  //       dispatch({ type: 'LOGIN', payload: userData });
  //     } catch (error) {
  //       console.log(error.message);
  //     }
  //   };

  //   useEffect(() => {
  //     fetchUser();
  //   }, []);

  const [state, dispatch] = useReducer(authReducer, {
    user: null,
  });

  console.log('AuthContext state:', state);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
