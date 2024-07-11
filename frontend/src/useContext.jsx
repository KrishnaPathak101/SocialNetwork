import React, { createContext, useEffect, useState } from 'react';
import { Circles } from 'react-loader-spinner';

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setUser(null);

    const fetchData = async () => {
      try {
        const response = await fetch('https://socialnetwork-zqhn.onrender.com/profile', {
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const userData = await response.json();
        console.log(userData);
        setUser(userData);
        setReady(true);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setUser(null);
        setReady(true); // Still mark as ready even if fetching fails
        setLoading(false); // Ensure loading is set to false in both success and error cases
      } finally {
        setLoading(false); // Ensure loading is set to false in both success and error cases
      }
    };

    fetchData();
  }, [setUser]);

  return (
    <UserContext.Provider value={{ user, setUser, ready, loading }}>
      {!loading ? children : <LoadingSpinner />} {/* Render children or loading spinner based on loading state */}
    </UserContext.Provider>
  );
}

// Example LoadingSpinner component
function LoadingSpinner() {
    return (
        <div className=" flex justify-center items-center w-full h-[100vh]">
          <Circles
            height="80"
            width="80"
            color="blue"
            ariaLabel="circles-loading"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
        </div>
      );
}
