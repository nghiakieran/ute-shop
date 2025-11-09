/**
 * Providers
 * Combine all providers
 */

import { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ReduxProvider } from './ReduxProvider';

interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <ReduxProvider>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </ReduxProvider>
  );
};

