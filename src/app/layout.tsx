import type { Metadata } from "next";
import "./globals.css";
import { AsgardeoProvider } from '@asgardeo/nextjs/server';
import { AsgardeoAuthProvider } from '@/context/AsgardeoAuthContext';
import ClientSWBootstrap from '../components/shared/ClientSWBootstrap';
import { asgardeoConfig } from '@/lib/asgardeo/config';

export const metadata: Metadata = {
  title: "BUSMATE LK - Transportation Management",
  description: "Transportation management dashboard for BUSMATE LK",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        <AsgardeoProvider
          baseUrl={asgardeoConfig.baseUrl}
          clientId={asgardeoConfig.clientId}
          clientSecret={asgardeoConfig.clientSecret}
          scopes={asgardeoConfig.scopes as string}
          preferences={{
            theme: {
              inheritFromBranding: false,
            }
          }}
        >
          <AsgardeoAuthProvider>
            <ClientSWBootstrap />
            {children}
          </AsgardeoAuthProvider>
        </AsgardeoProvider>
      </body>
    </html>
  );
}
