'use client';

import { Layout } from '@/components/shared/layout';


export default function RoutesPage() {

  return (
    <Layout
      activeItem="routes"
      pageTitle="Routes Workspace"
      pageDescription="Create or edit bus routes efficiently"
      role="mot"
      initialSidebarCollapsed={true}
    >
        <div></div>
    </Layout>
  );
}