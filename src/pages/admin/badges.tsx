import React from 'react';
import BadgeManager from '../../components/admin/BadgeManager';
import { getUserFromToken } from '../../../utils/auth';
import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const user = await getUserFromToken(context.req as any);
  if (!user || user.role !== 'super_admin') {
    return { redirect: { destination: '/', permanent: false } };
  }
  return { props: {} };
};

export default function BadgesPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto" style={{ backgroundColor: 'var(--color-surface)' }}>
      <h1 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-text-main)' }}>Gerenciar Badges</h1>
      <BadgeManager />
    </div>
  );
}
