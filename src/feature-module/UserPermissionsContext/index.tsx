import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type UserPermissionsContextType = {
  userPermissions: any[];
  setUserPermissions: React.Dispatch<React.SetStateAction<any[]>>;
  userData: any;
  setUserData: React.Dispatch<React.SetStateAction<any>>;
  webApi: string;
  userProfile: {
    branches: number[];
    // Add other properties of userProfile here
  };
  setUserProfile: React.Dispatch<React.SetStateAction<{ branches: number[] }>>;
};

const UserPermissionsContext = createContext<UserPermissionsContextType | undefined>(undefined);

interface UserPermissionsProviderProps {
  children: ReactNode;
}

export const UserPermissionsProvider: React.FC<UserPermissionsProviderProps> = ({ children }) => {
  const [userPermissions, setUserPermissions] = useState<any[]>(() => {
    const savedPermissions = localStorage.getItem('userPermissions');
    return savedPermissions ? JSON.parse(savedPermissions) : [];
  });
  const [userData, setUserData] = useState<any>(() => {
    const savedUserData = localStorage.getItem('userData');
    return savedUserData ? JSON.parse(savedUserData) : null;
  });
  const [userProfile, setUserProfile] = useState<{ branches: number[] }>(() => {
    const savedUserProfile = localStorage.getItem('userProfile');
    return savedUserProfile ? JSON.parse(savedUserProfile) : { branches: [] };
  });

  // const webApi = 'https://apinetwork.sctickets.in'; 
  const webApi = 'http://10.30.30.122:8000'
  // const webApi = 'http://10.10.8.17:8000';   

  useEffect(() => {
    try {
      localStorage.setItem('userPermissions', JSON.stringify(userPermissions));
    } catch (error) {
      console.error("Error saving userPermissions to localStorage:", error);
    }
  }, [userPermissions]);

  useEffect(() => {
    try {
      localStorage.setItem('userData', JSON.stringify(userData));
    } catch (error) {
      console.error("Error saving userData to localStorage:", error);
    }
  }, [userData]);

  useEffect(() => {
    try {
      localStorage.setItem('userProfile', JSON.stringify(userProfile));
    } catch (error) {
      console.error("Error saving userProfile to localStorage:", error);
    }
  }, [userProfile]);

  return (
    <UserPermissionsContext.Provider value={{ userPermissions, setUserPermissions, userData, setUserData, webApi, userProfile, setUserProfile }}>
      {children}
    </UserPermissionsContext.Provider>
  );
};

export const useUserPermissions = () => {
  const context = useContext(UserPermissionsContext);
  if (!context) {
    throw new Error('useUserPermissions must be used within a UserPermissionsProvider');
  }
  return context;
};
