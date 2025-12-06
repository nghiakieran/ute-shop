/**
 * App Component
 * Root component
 */

import { Toaster } from 'react-hot-toast';
import { AppRoutes } from './routes';

function App() {
  return (
    <>
      <AppRoutes />
      <Toaster position="bottom-right" />
    </>
  );
}

export default App;

