import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Planner from './pages/Planner';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/planner" element={<Planner />} />
        <Route path="*" element={<Navigate to="/planner" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;