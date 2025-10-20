import { TimeKeeperTripAssignment } from '@/components/timeKeeper/trip-assignment-workspace';
import { Metadata } from 'next';
import { Layout } from '@/components/shared/layout';

export const metadata: Metadata = {
  title: 'Trip Assignment | BusMate',
  description:
    'Manage trip assignments for trips starting from your assigned bus stop',
};

export default function TimeKeeperTripAssignmentPage() {
  return (
    <Layout
      activeItem="trip-assignment"
      pageTitle="Trip Assignment Management"
      pageDescription="Manage and reassign buses for trips starting from your assigned bus stop"
      role="timeKeeper"
      padding={0}
    >
      <TimeKeeperTripAssignment />
    </Layout>
  );
}
