import type React from 'react';

// Authenticated layout wrapper for Time Keeper portal
// Add your authentication check here in the future
export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // You can add authentication logic here
  // For example: redirect to login if not authenticated
  // const session = await getSession();
  // if (!session) redirect('/login');

  return <>{children}</>;
}
