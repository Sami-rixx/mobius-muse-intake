import { Routes, Route, Navigate } from 'react-router-dom';
import { Step1, Step2, Step3, Review, Success } from './pages';
import { MainLayout } from './components/layout/MainLayout';

function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/step1" replace />} />
        <Route path="/step1" element={<Step1 />} />
        <Route path="/step2" element={<Step2 />} />
        <Route path="/step3" element={<Step3 />} />
        <Route path="/review" element={<Review />} />
        <Route path="/success" element={<Success />} />
      </Routes>
    </MainLayout>
  );
}

export default App;
