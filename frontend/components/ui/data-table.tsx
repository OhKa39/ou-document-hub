'use client';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
  getFilteredRowModel,
} from '@tanstack/react-table';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DataTablePagination } from '../DataTablePagination/DataTablePagination';
import { DataTableViewOptions } from '../DataTableViewOption/DataTableViewOption';
import React, { ReactNode, useEffect, useState } from 'react';
import { Input } from './input';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data?: TData[];
  fetchData?: (pageIndex: number, pageSize: number, sorting: SortingState, globalFilter: string) => Promise<any>;
  searchPlaceholder?: string;
  AddButton?: React.ReactNode;
}

export function DataTable<TData, TValue>({
  columns,
  data: initialData,
  fetchData,
  searchPlaceholder,
  AddButton,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [data, setData] = useState<any>(initialData ?? []);
  const [globalFilter, setGlobalFilter] = useState('');
  const [totalRows, setTotalRows] = useState(0);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [rowSelection, setRowSelection] = React.useState({});

  useEffect(() => {
    if (fetchData) {
      const loadData = async () => {
        const response = await fetchData(pagination.pageIndex, pagination.pageSize, sorting, globalFilter); // Fetch data based on current pagination, sorting, and filtering
        setData(response.data?.content ?? []); // Update the data for the current page
        setTotalRows(response.total ?? 0); // Update the total number of rows
      };
      loadData();
    }
  }, [pagination.pageIndex, pagination.pageSize, sorting, globalFilter, fetchData]);

  const table = useReactTable({
    data: fetchData ? data : (initialData ?? []), // Use client-side data if available, otherwise server-side fetched data
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting, // Update sorting state on user action
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(), // Apply global filter across all columns
    manualPagination: !!fetchData, // Enable manual pagination for server-side
    manualSorting: !!fetchData, // Enable manual sorting for server-side
    manualFiltering: !!fetchData, // Enable manual global filtering for server-side
    state: {
      sorting,
      pagination,
      globalFilter,
      rowSelection,
    },
    pageCount: fetchData ? Math.ceil(totalRows / pagination.pageSize) : undefined, // Set page count for server-side
    onPaginationChange: setPagination, // Update pagination state on user action
    onGlobalFilterChange: setGlobalFilter, // Update global filter state on user action
    onRowSelectionChange: setRowSelection,
  });

  return (
    <>
      <div className="flex items-center justify-between pb-4">
        <div className="relative h-[32px] w-[250px]">
          <Input
            className="w-full rounded-md"
            placeholder={searchPlaceholder}
            type="text"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-4">
          {AddButton}
          <DataTableViewOptions table={table} />
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </>
  );
}
