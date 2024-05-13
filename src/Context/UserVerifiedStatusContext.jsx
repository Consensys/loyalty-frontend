import React, { createContext, useState, useContext } from "react";

const UserVerificationContext = createContext();

export const UserVerificationProvider = ({ children }) => {
  const [userVerifiedStatus, setUserVerifiedStatus] = useState(false);

  const verifyUser = () => setUserVerifiedStatus(true);

  const value = { userVerifiedStatus, verifyUser };

  return (
    <UserVerificationContext.Provider value={value}>
      {children}
    </UserVerificationContext.Provider>
  );
};

export const useUserVerification = () => {
  const context = useContext(UserVerificationContext);
  if (!context) {
    throw new Error(
      "useUserVerification must be used within UserVerificationProvider",
    );
  }
  return context;
};
