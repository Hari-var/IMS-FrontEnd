import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import FNOLPage from './pages/FNOLPage';
import './App.css';

/**
 * App Component
 *
 * Main application component that serves as the root wrapper.
 * Configures routing for all pages including Home (Login) and FNOL form.
 */
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/fnol" element={<FNOLPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
