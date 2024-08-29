import React, { createContext, useContext, useState, useEffect } from 'react';

const CurrentChatContext = createContext();

export const useCurrentChat = () => useContext(CurrentChatContext);

export const CurrentChatProvider = ({ children }) => {
  const [currentChat, setCurrentChat] = useState(localStorage.getItem('currentChat') || '');
  const [currentModel, setCurrentModel] = useState(localStorage.getItem('model') || '');
  useEffect(()=>{
    console.log(currentModel)
  })
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === 'currentChat') {
        setCurrentChat(event.newValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('currentChat', currentChat);
  }, [currentChat]);
  useEffect(()=>{
    
  })
  return (
    <CurrentChatContext.Provider value={{ currentChat, setCurrentChat, currentModel, setCurrentModel }}>
      {children}
    </CurrentChatContext.Provider>
  );
};
