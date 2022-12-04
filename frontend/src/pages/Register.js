import { useState } from 'react';
import { register } from '../services/appwriteConfig';
import { useNavigate, Link } from 'react-router-dom';

import './RegisterLogin.css';

import swal from 'sweetalert';

export const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await register(email, password);
      const useremail = user && user.email ? user.email : user.providerUid;
      console.log('Email inside registration', useremail, user.$id);
      const response = await fetch(
        `http://localhost:5000/api/v1/user/create/`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: useremail,
            appwriteId: user.$id,
          }),
        }
      );
      //   const json = await response.json();
      if (response.ok) {
        setEmail('');
        setPassword('');
        swal(
          'Good Job!',
          'Successfully registered, go to Login page',
          'success'
        );
        navigate('/login');
      }

      console.log(user);
    } catch (error) {
      console.log('error message', error.message);
    }
  };

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
          <button>Register</button>
          <span className="goto-link">
            Already have an account?<Link to="/login"> Login</Link>
          </span>
        </form>
      </div>
    </div>
  );
};
