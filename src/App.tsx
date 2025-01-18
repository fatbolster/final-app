import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Dashboard from "./Dashboard";
import InputPage from "./InputPage";
import Submissions from "./Submissions";
import FixedDeposits from "./FixedDeposits";
import { ExpenditureProvider } from "./ExpenditureContext";
import { UserProvider } from "./UserContext";
import Navbar from "./Navbar";
import FormModal from "./FormModal";
import AlertComponent from "./AlertComponent";
import Transactions from "./Transactions";
import { MonthProvider } from "./MouthContext";

const App: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <MonthProvider>
      <ExpenditureProvider>
        <UserProvider>
          <Router>
            <Navbar onOpenForm={() => setIsFormOpen(true)} />
            {isFormOpen && <FormModal onClose={() => setIsFormOpen(false)} />}
            <div style={{ display: "flex" }}>
              <div style={{ flex: 3, padding: "20px" }}>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/input" element={<InputPage />} />
                  <Route path="/submissions" element={<Submissions />} />
                  <Route path="/fixed-deposits" element={<FixedDeposits />} />
                  <Route path="/transactions" element={<Transactions />} />
                </Routes>
              </div>
              <Sidebar />
            </div>
          </Router>
        </UserProvider>
      </ExpenditureProvider>
    </MonthProvider>
  );
};

// Sidebar component to conditionally render the AlertComponent
const Sidebar: React.FC = () => {
  const location = useLocation(); // Get the current route

  const hideAlertOnRoutes = ["/input", "/fixed-deposits"]; // Routes where AlertComponent should be hidden

  return (
    <div
      style={{
        flex: 1,
        padding: "20px",
        borderLeft: hideAlertOnRoutes.includes(location.pathname)
          ? "none"
          : "1px solid #ccc",
      }}
    >
      {!hideAlertOnRoutes.includes(location.pathname) && <AlertComponent />}
    </div>
  );
};

export default App;
