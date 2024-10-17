import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FacultyOverview from '../faculty-management/FacultyOverview';
import ShippingAddress from './ShippingAddress';
import DocumentOverview from './DocumentOverview';

const TabTransition = () => {
  return (
    <div>
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="faculty">Faculty</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        <DocumentOverview />
        <FacultyOverview />
        <ShippingAddress />
      </Tabs>
    </div>
  );
};

export default TabTransition;
