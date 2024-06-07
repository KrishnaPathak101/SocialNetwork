import React, { createContext, useEffect, useState } from 'react'

export const UserContext = createContext({});

export function UserContextProvider({ children }) {

    const [user, setUser] = useState(null)
    const [ready, setReady] = useState(false);

    useEffect(() => {

        
        
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
                    if(!userData){
                        setUser(null);
                    }else{
                        setUser(userData);
                    }
                    setReady(true);
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            };

            fetchData();
            
        }, [ setUser  ]);

    return (
        <UserContext.Provider value={{ user, setUser, ready }}>
            {children}
        </UserContext.Provider>
    )
}
