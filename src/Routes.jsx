import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop"; // Adjust the path as necessary
import ErrorBoundary from "./components/ErrorBoundary"; // Adjust the path as necessary
import NotFound from "./pages/NotFound"; // Adjust the path as necessary
import SSLCertificateManagement from './pages/ssl-certificate-management';
import VeniceAIAssistant from './pages/venice-ai-assistant';
import MultiBotManagement from './pages/multi-bot-management';
import BotConfiguration from './pages/bot-configuration';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          {/* Define your routes here */}
          <Route path="/" element={<BotConfiguration />} />
          <Route path="/ssl-certificate-management" element={<SSLCertificateManagement />} />
          <Route path="/venice-ai-assistant" element={<VeniceAIAssistant />} />
          <Route path="/multi-bot-management" element={<MultiBotManagement />} />
          <Route path="/bot-configuration" element={<BotConfiguration />} />
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
