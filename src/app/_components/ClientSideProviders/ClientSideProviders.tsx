'use client';

import type { ReactNode } from 'react';
import { Provider } from 'jotai';
// import { Toaster } from '@/components'; // Removed - not needed for agent directory

interface ClientSideProvidersProps {
  children: ReactNode;
}

export function ClientSideProviders(props: ClientSideProvidersProps) {
  const { children } = props;

  return (
    <>
      <Provider>{children}</Provider>
      {/* <Toaster /> */}
    </>
  );
}
