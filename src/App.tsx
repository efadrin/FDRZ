import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Provider, useSelector } from "react-redux";
import { store, RootState } from "./store/store";
import { AuthProvider } from "./contexts/AuthContext";
import Layout from "./components/Layout";
import LoginPage from "./components/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import WorkflowsPage from "./pages/WorkflowsPage";
import { AuthStatusConst } from "./utils/constants";
import "./App.css";

const AppContent = () => {
  const authStatus = useSelector((state: RootState) => state.auth.status);
  const isLoading = useSelector((state: RootState) => state.auth.isLoading);

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {authStatus === AuthStatusConst.initial && (
          <Route path="*" element={<LoginPage />} />
        )}
        {authStatus === AuthStatusConst.loggedIn && (
          <>
            <Route path="/login" element={<Navigate to="/" replace />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route
                path="dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="workflows"
                element={
                  <ProtectedRoute>
                    <WorkflowsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="workflows/:id"
                element={
                  <ProtectedRoute>
                    <div>Workflow Detail Page (To be implemented)</div>
                  </ProtectedRoute>
                }
              />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
        {authStatus === AuthStatusConst.failed && (
          <Route
            path="*"
            element={
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100vh",
                }}
              >
                <div>
                  <p>Failed to authenticate. Please try again.</p>
                  <LoginPage />
                </div>
              </div>
            }
          />
        )}
      </Routes>
    </Router>
  );
};

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Provider>
  );
}

export default App;
