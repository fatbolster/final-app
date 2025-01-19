import React, { createContext, useState, ReactNode } from "react";

interface Submission {
  ageRange: string;
  monthlyIncome: number;
  targetNetWorth: number;
  targetSavings: number;
  date: string;
}

interface UserContextType {
  submissions: Submission[];
  addSubmission: (submission: Submission) => void;
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [submissions, setSubmissions] = useState<Submission[]>([
    {
      ageRange: "26-30",
      monthlyIncome: 5000,
      targetNetWorth: 3000,
      targetSavings: 2000,
      date: new Date().toLocaleString(),
    },
  ]);

  const addSubmission = (submission: Submission) => {
    setSubmissions((prev) => [...prev, submission]);
  };

  return (
    <UserContext.Provider value={{ submissions, addSubmission }}>
      {children}
    </UserContext.Provider>
  );
};
