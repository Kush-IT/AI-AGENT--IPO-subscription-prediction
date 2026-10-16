import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Dashboard } from './pages/Dashboard';
import { About } from './pages/About';
import { Monitoring } from './pages/Monitoring';
import { ModelPrediction } from './pages/ModelPrediction';
import { Diagrams } from './pages/Diagrams';
import { DataFlow } from './pages/DataFlow';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30000,
    },
  },
});

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <div className="app-container">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/model-prediction" element={<ModelPrediction />} />
              <Route path="/diagrams" element={<Diagrams />} />
              <Route path="/data-flow" element={<DataFlow />} />
              <Route path="/monitoring" element={<Monitoring />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
