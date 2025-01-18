import React, { createContext, useContext, useState } from "react";

interface MonthContextType {
  selectedMonth: string;
  setSelectedMonth: React.Dispatch<React.SetStateAction<string>>;
}

const MonthContext = createContext<MonthContextType | undefined>(undefined);

export const MonthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [selectedMonth, setSelectedMonth] = useState<string>("");

  return (
    <MonthContext.Provider value={{ selectedMonth, setSelectedMonth }}>
      {children}
    </MonthContext.Provider>
  );
};

export const useMonthContext = () => {
  const context = useContext(MonthContext);
  if (!context) {
    throw new Error("useMonthContext must be used within a MonthProvider");
  }
  return context;
};
