import React, { useContext, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { logout, getUser } from '../services/appwriteConfig';
import './Navbar.css';

export const Navbar = () => {
  const { user, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  //Fetch initial user state using AppWrite function.
  const fetchUser = async () => {
    try {
      const userData = await getUser();
      console.log('WHAT IS INSIDE NAVBAR', userData);
      dispatch({ type: 'LOAD_INITIAL_USER', payload: userData });
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const onLogout = async (e) => {
    e.preventDefault();
    await logout();
    dispatch({ type: 'LOGOUT' });
    navigate('/login');
  };

  // console.log('FROM HOME TO SEE EMAI', user && user.email.split('@')[0]);

  return (
    <div className="navbar-section">
      <div className="left-section">iNeuronTodo</div>
      <div className="middle-section">
        {user &&
          (user.email
            ? '@' + user.email.split('@')[0]
            : '@' + user.providerUid.split('@')[0])}
      </div>
      <ul className="right-section">
        <li>
          {user && (
            <>
              <button className="logout-button" onClick={(e) => onLogout(e)}>
                Logout
              </button>
            </>
          )}
        </li>
      </ul>
    </div>
  );
};
