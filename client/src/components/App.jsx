// src/components/App.jsx

import { BrowserRouter, Routes, Route } from "react-router-dom";
import MentorChatApp from "./MentorChatApp";
import Login from "./Login";
import PrivateRoute from "./PrivateRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* page de login publique */}
        <Route path="/login" element={<Login />} />

        {/* tout le reste est protégé */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <MentorChatApp />
            </PrivateRoute>
          }
        />
        {/* si tu as d'autres routes, tu peux les ajouter ici */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
