"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type UserInfo = {
  username: string;
  email: string;
};

type UserContextType = {
  userInfo: UserInfo | null;
  setUserInfo: (user: UserInfo) => void;
  isSignedIn: boolean;
  isSignedEnable: (val: boolean) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isSignedIn, isSignedEnable] = useState(false);

  return (
    <UserContext.Provider
      value={{ userInfo, setUserInfo, isSignedIn, isSignedEnable }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};
