import CounterAnalytic from '@/components/admin/dashboard/CounterAnalytic';
import React from 'react';

const Dashboard = () => {
  return (
    <div className="h-full bg-[#F5F6FA] px-8">
      <p className="py-6 text-3xl font-extrabold">Dashboard</p>
      <CounterAnalytic />
    </div>
  );
};

export default Dashboard;
