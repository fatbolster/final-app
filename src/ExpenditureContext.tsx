import React, { createContext, useState, ReactNode } from "react";

interface ExpenditureState {
  food: number;
  entertainment: number;
  shopping: number;
  lifestyle: number;
}

interface ExpenditureContextType {
  expenditures: ExpenditureState;
  addExpenditure: (sector: keyof ExpenditureState, amount: number) => void;
  getTotalExpenditure: () => number; // Method to calculate total expenditure
}

export const ExpenditureContext = createContext<
  ExpenditureContextType | undefined
>(undefined);

export const ExpenditureProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [expenditures, setExpenditures] = useState<ExpenditureState>({
    food: 0,
    entertainment: 0,
    shopping: 0,
    lifestyle: 0,
  });

  const addExpenditure = (sector: keyof ExpenditureState, amount: number) => {
    setExpenditures((prev) => ({
      ...prev,
      [sector]: prev[sector] + amount,
    }));
  };

  const getTotalExpenditure = () => {
    return Object.values(expenditures).reduce(
      (total, amount) => total + amount,
      0
    );
  };

  return (
    <ExpenditureContext.Provider
      value={{ expenditures, addExpenditure, getTotalExpenditure }}
    >
      {children}
    </ExpenditureContext.Provider>
  );
};
