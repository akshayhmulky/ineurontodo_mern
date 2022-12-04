import { useState, useContext } from 'react';
import { login } from '../services/appwriteConfig';

import { useNavigate, Navigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

import swal from 'sweetalert';

import './RegisterLogin.css';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { user, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(email, password);
      const user = await login(email, password);

      // update the auth context
      dispatch({ type: 'LOGIN', payload: user });

      setEmail('');
      setPassword('');
      navigate('/');
    } catch (error) {
      console.log('error message', error.message);
      // toast.error('Invalid username or password!', {
      //   position: toast.POSITION.TOP_RIGHT,
      // });
      swal('ERROR', 'Invalid username or password', 'error');
    }
  };

  if (user) {
    return <Navigate replace to="/" />;
  }

  return (
    <div>
      <div className="myform">
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="email"
            placeholder="Enter your Email address"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          <button>Login</button>
          <span className="goto-link">
            Do not have an account?<Link to="/register"> Register</Link>
          </span>
        </form>
      </div>
    </div>
  );
};
