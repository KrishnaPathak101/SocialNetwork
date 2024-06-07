import React, { useState } from 'react';
import axios from 'axios'

const Signup = () => {
  const [username, setUsername] = useState('');
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { username, fullname, email, password };
    try {
      const res = await axios.post('https://socialnetwork-zqhn.onrender.com/signup', data);
      console.log(res);
      console.log(res.data);
      if (res.data.status === 'success') {
        alert(res.data.message);
        window.location.href = '/';
      } else {
        alert(res.data.message);
      }


    } catch (error) {
      console.log(error);
    }
                                     
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Create an Account</h1>
      </div>

      {/* SIGNUP FORM */}
      <form onSubmit={handleSubmit}  className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">Username</label>
          <input value={username} onChange={(e) => setUsername(e.target.value)} type="text" name="username" id="username" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
        </div>
        <div className="mb-4">
          <label htmlFor="fullname" className="block text-gray-700 text-sm font-bold mb-2">Full Name</label>
          <input value={fullname} onChange={(e) => setFullname(e.target.value)} type="text" name="fullname" id="fullname" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" name="email" id="email" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Password</label>
          <input value={password} onChange={(e) => setPassword(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" type="password" name="password" id="password"/>
        </div>
        <div className="flex items-center justify-between">
          <button  onClick={handleSubmit} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
}

export default Signup;
