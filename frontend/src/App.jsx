import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          gutter={10}
          toastOptions={{
            duration: 3500,
            style: {
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.875rem',
              fontWeight: 500,
              borderRadius: '12px',
              padding: '10px 14px',
              background: '#FFFFFF',
              color: '#1C2333',
              border: '1px solid #E8E2D8',
              boxShadow: '0 4px 16px rgba(28,35,51,0.12)',
              // Slide-in from top-right via CSS animation defined in index.css
              animation: 'toastSlideIn 200ms cubic-bezier(0.16,1,0.3,1) both',
            },
            success: {
              iconTheme: { primary: '#10B981', secondary: '#fff' },
              style: { borderLeft: '3px solid #10B981' },
            },
            error: {
              iconTheme: { primary: '#F43F5E', secondary: '#fff' },
              style: { borderLeft: '3px solid #F43F5E' },
            },
          }}
        />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
