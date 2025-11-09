/**
 * App Component
 * Root component
 */

import { AppRoutes } from './routes';
import { ToastProvider } from './components/Toast';

function App() {
  return (
    <ToastProvider>
      <AppRoutes />
    </ToastProvider>
  );
}

export default App;

