'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import ServerFetch from '@/utils/ServerFetch';

interface AnalyticItem {
  name: string;
  count: number;
  iconLink: string;
  percentageChange: number;
}

const CounterAnalytic = () => {
  const [analytics, setAnalytics] = useState<AnalyticItem[]>([]);
  const [period, setPeriod] = useState<'DAY' | 'WEEK' | 'MONTH'>('WEEK');
  const [loading, setLoading] = useState(false);

  // Fetch analytics based on selected period
  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const response = await ServerFetch(`/api/v1/analytics?period=${period}`, {
          headers: {
            method: 'GET',
          },
        });
        const data = await response.json();
        setAnalytics(data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [period]);

  // Handle period change
  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPeriod(e.target.value as 'DAY' | 'WEEK' | 'MONTH');
  };

  return (
    <div className="w-full">
      {/* Period Selector */}
      <div className="mb-6 flex justify-end">
        <select
          value={period}
          onChange={handlePeriodChange}
          className="rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-[#00B69B]"
        >
          <option value="DAY">Ngày</option>
          <option value="WEEK">Tuần</option>
          <option value="MONTH">Tháng</option>
        </select>
      </div>

      {/* Analytics Grid */}
      <div className="grid w-full gap-8 md:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          <p className="col-span-4 text-center">Đang tải...</p>
        ) : analytics.length === 0 ? (
          <p className="col-span-4 text-center">Không có dữ liệu</p>
        ) : (
          analytics.map((item, index) => (
            <div
              key={index}
              className="flex h-[161px] min-w-[262px] flex-col items-center justify-center gap-8 rounded-xl bg-white shadow-md"
            >
              <div className="mt-1 flex w-[90%] items-center justify-between gap-2">
                <div className="flex flex-col gap-4">
                  <p className="font-semibold text-[#202224]/70">{item.name}</p>
                  <p className="text-2xl font-bold">{item.count.toLocaleString()}</p>
                </div>
                <Image src={item.iconLink} alt={`${item.name} icon`} width={60} height={60} />
              </div>
              <div className="flex w-[90%] items-center gap-2">
                <Image src="/ic-trending-up-24px.svg" alt="trending icon" width={24} height={24} />
                <p>
                  <span className="text-[#00B69B]">{item.percentageChange.toFixed(1)}% </span>
                  {period === 'DAY'
                    ? 'Tăng so với ngày trước'
                    : period === 'WEEK'
                      ? 'Tăng so với tuần trước'
                      : 'Tăng so với tháng trước'}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CounterAnalytic;
