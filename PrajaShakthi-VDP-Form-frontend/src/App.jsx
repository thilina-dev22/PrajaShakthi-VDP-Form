import React, { useState } from "react";
import "./App.css";
import DevelopmentForm from "./components/DevelopmentForm";
import CommunityCouncilForm from "./components/CommunityCouncilForm";
import SubmissionList from "./components/SubmissionList";
import Login from "./components/Login";
import { useAuth } from "./context/AuthContext";

const Navigation = ({ setCurrentRoute, isAuthenticated, isAdmin, logout }) => {
  // Call useAuth unconditionally at the top level of the component.
  const { user } = useAuth();

  // Define a constant to control the disabled state.
  const isDevelopmentFormDisabled = true;

  return (
    <header
      style={{
        padding: "10px 40px",
        background: "#0056b3",
        color: "white",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <h1 style={{ margin: 0, fontSize: "1.5rem" }}>PrajaShakthi VDP Form</h1>

      {isAuthenticated && !isAdmin && (
        <nav>
          <button
            onClick={() => setCurrentRoute("development")}
            style={{
              background: "none",
              color: "white",
              border: "1px solid white",
              padding: "8px 15px",
              borderRadius: "4px",
              cursor: isDevelopmentFormDisabled ? "not-allowed" : "pointer",
              marginRight: "10px",
              opacity: isDevelopmentFormDisabled ? 0.6 : 1,
            }}
            disabled={isDevelopmentFormDisabled}
          >
            සංවර්ධන සැලැස්ම (Main Form)
          </button>
          <button
            onClick={() => setCurrentRoute("council")}
            style={{
              background: "none",
              color: "white",
              border: "1px solid white",
              padding: "8px 15px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            ප්‍රජා සභා තොරතුරු (Council Info)
          </button>
        </nav>
      )}

      {isAuthenticated ? (
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <span>
            Logged in as:{" "}
            <strong>
              {/* Use the 'user' variable from the hook call above. */}
              {user ? `${user.username} (${user.role})` : ''}
            </strong>
          </span>
          <button
            onClick={logout}
            style={{
              background: "#dc3545",
              color: "white",
              border: "none",
              padding: "8px 15px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>
      ) : (
        <span>Please log in</span>
      )}
    </header>
  );
};

function App() {
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const [currentRoute, setCurrentRoute] = useState("council");

  let content;

  if (!isAuthenticated) {
    content = <Login />;
  } else if (isAdmin) {
    content = <SubmissionList />;
  } else {
    switch (currentRoute) {
      case "council":
        content = <CommunityCouncilForm />;
        break;
      case "development":
      default:
        content = <DevelopmentForm />;
    }
  }

  return (
    <>
      <Navigation
        setCurrentRoute={setCurrentRoute}
        isAuthenticated={isAuthenticated}
        isAdmin={isAdmin}
        logout={logout}
      />
      <div style={{ padding: "20px" }}>{content}</div>
    </>
  );
}

export default App;