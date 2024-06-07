import { useContext, useState } from "react";
import { UserContext } from "../useContext";
import axios from "axios";

const LeftSidebar = () => {
    const {user} = useContext(UserContext);  
  
    const [darkMode, setDarkMode] = useState(false);
    const toggleDarkMode = () => {
      setDarkMode(!darkMode);
    };
  
    const handleLogout = async() => {
      // Add your logout logic here
      await axios.post("http://localhost:4000/logout", {}, { withCredentials: true });
      window.location.reload();
    };
  
    return (
      <div className="w-60 border-r border-gray-200 dark:border-gray-800  p-4 fixed h-full">
        <div className="mt-4 flex flex-col space-y-5">
          <a href="/" className="w-full text-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded">Home</a >
          <a href={`/profile/${user?._id}`} className="w-full text-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded">Profile</a >
        </div>
  
        <div className="mt-[200px]">
         
        </div>
  
        {/* LOGOUT BUTTON */}
        <div className=' mt-4'>
        <button onClick={handleLogout} className="w-full bg-white hover:bg-blue-600 text-black font-semibold py-2 px-4 rounded">
            {user ? 'Logout' : 'Login'}
          </button>
  
        </div>
      </div>
    );
  };

  export default LeftSidebar