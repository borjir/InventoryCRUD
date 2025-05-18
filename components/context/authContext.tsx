import React, { createContext, useContext, useState } from 'react';

interface AuthContextProps {
  username: string;
  setUsername: (username: string) => void;
  roleFlag: number; // 1 for admin, 0 for user
  setRoleFlag: (flag: number) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [username, setUsername] = useState('');
  const [roleFlag, setRoleFlag] = useState(0);

  return (
    <AuthContext.Provider value={{ username, setUsername, roleFlag, setRoleFlag }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
