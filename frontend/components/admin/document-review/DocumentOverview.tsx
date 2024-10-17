import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import React from 'react';

const DocumentOverview = () => {
  return (
    <TabsContent value="overview">
      <Card>
        <CardHeader>
          <CardTitle>Document Overview</CardTitle>
          <CardDescription>View and edit the document's main content.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>Document content goes here...</p>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default DocumentOverview;
