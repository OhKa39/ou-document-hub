import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { IoMdAddCircleOutline } from 'react-icons/io';
import FacultyForm from '@/components/Forms/FacultyForm';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
type props = {
  data: any;
  columns: ColumnDef<any>[];
  title: string;
  description: string;
  AddButton?: any;
  searchPlaceholder: string;
};

const DataTableOverview = ({ data, columns, description, title, AddButton, searchPlaceholder }: props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <DataTable columns={columns} data={data ?? []} AddButton={AddButton} searchPlaceholder={searchPlaceholder} />
      </CardContent>
    </Card>
  );
};

export default DataTableOverview;
