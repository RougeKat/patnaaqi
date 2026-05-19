import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Placeholder from './pages/Placeholder';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="stations" element={<Placeholder title="Stations" />} />
          <Route path="map" element={<Placeholder title="Interactive Map" />} />
          <Route path="reports" element={<Placeholder title="Environmental Reports" />} />
          <Route path="more" element={<Placeholder title="More Menu" />} />
          <Route path="analytics" element={<Placeholder title="Analytics Dashboard" />} />
          <Route path="blog" element={<Placeholder title="Blog & Insights" />} />
          <Route path="about" element={<Placeholder title="About PatnaAQI" />} />
          {/* <Route path="api" element={<Placeholder title="Public API" />} /> */}
          <Route path="*" element={<Placeholder title="404 - Not Found" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
