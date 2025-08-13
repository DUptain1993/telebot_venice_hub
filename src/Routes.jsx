import React, { Suspense } from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";

// Lazy load components for better performance
const NotFound = React.lazy(() => import("pages/NotFound"));
const SSLCertificateManagement = React.lazy(() => import('./pages/ssl-certificate-management'));
const VeniceAIAssistant = React.lazy(() => import('./pages/venice-ai-assistant'));
const MultiBotManagement = React.lazy(() => import('./pages/multi-bot-management'));
const BotConfiguration = React.lazy(() => import('./pages/bot-configuration'));

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-neutral-50">
    <div className="flex flex-col items-center space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      <p className="text-sm text-muted-foreground">Loading...</p>
    </div>
  </div>
);

// Route wrapper with error boundary
const RouteWrapper = ({ children }) => (
  <ErrorBoundary>
    <Suspense fallback={<LoadingSpinner />}>
      {children}
    </Suspense>
  </ErrorBoundary>
);

const Routes = () => {
  return (
    <BrowserRouter future={{ 
      v7_startTransition: true,
      v7_relativeSplatPath: true 
    }}>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          {/* Define your routes here */}
          <Route 
            path="/" 
            element={
              <RouteWrapper>
                <BotConfiguration />
              </RouteWrapper>
            } 
          />
          <Route 
            path="/ssl-certificate-management" 
            element={
              <RouteWrapper>
                <SSLCertificateManagement />
              </RouteWrapper>
            } 
          />
          <Route 
            path="/venice-ai-assistant" 
            element={
              <RouteWrapper>
                <VeniceAIAssistant />
              </RouteWrapper>
            } 
          />
          <Route 
            path="/multi-bot-management" 
            element={
              <RouteWrapper>
                <MultiBotManagement />
              </RouteWrapper>
            } 
          />
          <Route 
            path="/bot-configuration" 
            element={
              <RouteWrapper>
                <BotConfiguration />
              </RouteWrapper>
            } 
          />
          <Route 
            path="*" 
            element={
              <RouteWrapper>
                <NotFound />
              </RouteWrapper>
            } 
          />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;