// components/users/UserTable.tsx
'use client'

import * as React from 'react'
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table'
import {ChevronDown } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { CreateUserDialog } from '@/components/user/createUserDialog'
import { EditUserDialog } from '@/components/user/editUserDialog'
import { DeleteConfirmationDialog } from '@/components/user/deleteConfirmationDialog'

// types/user.ts
export type User = {
    id: number
    nama: string
    alamat: string
    tempatLahir: string
    tanggalLahir: string // This will store the date string from the input
}

export default function UserTable() {
    const [data, setData] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({});

    const columns: ColumnDef<User>[] = [
        {
            id: 'select',
            header: ({ table }) => (
            <Checkbox
                checked={
                table.getIsAllPageRowsSelected() ||
                (table.getIsSomePageRowsSelected() && 'indeterminate')
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
            ),
            cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
            ),
            enableSorting: false,
            enableHiding: false,
            size: 40,
        },
        {
            accessorKey: 'nama',
            header: 'Nama',
            cell: ({ row }) => (
            <div className="capitalize w-[200px] truncate">{row.getValue('nama')}</div>
            ),
            size: 200,
        },
        {
            accessorKey: 'alamat',
            header: 'Alamat',
            cell: ({ row }) => (
            <div className="lowercase w-[250px] truncate">{row.getValue('alamat')}</div>
            ),
            size: 250,
        },{
            accessorKey: 'tempatLahir',
            header: 'Tempat Lahir',
            cell: ({ row }) => (
            <div className="lowercase w-[250px] truncate flex flex-col gap-1">{row.getValue('tempatLahir')} </div>
            ),
            size: 250,
        },
        {
            accessorKey: 'tanggalLahir',
            header: ' Tanggal Lahir',
            cell: ({ row }) => (
            <div className="lowercase w-[250px] truncate flex flex-col gap-1">{convertDate(row.getValue('tanggalLahir'))}</div>
            ),
            size: 250,
        },
        {
            id: 'actions',
            enableHiding: false,
            cell: ({ row }) => {
            const user = row.original

            return (
                <div className="flex gap-2">
                <EditUserDialog
                    user={user}
                    onSuccess={refreshData}
                />
                <DeleteConfirmationDialog
                    id={user.id}
                    endpoint="/api/users"
                    onSuccess={refreshData}
                />
                </div>
            )
            },
            size: 120,
        },
    ]

    const convertDate = (isoDateString : string) => {
        const date = new Date(isoDateString);
        console.log(isoDateString, date)
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
        const year = String(date.getFullYear()); // Get last two digits of the year
    return `${day}-${month}-${year}`;
    };

    const refreshData = async () => {
        try {
        setLoading(true)
        const response = await fetch('/api/users')
        const result = await response.json()
        console.log(result)
        setData(result)
        } catch (error) {
        console.error('Error fetching users:', error)
        toast.error('Gagal memuat data pengguna')
        } finally {
        setLoading(false)
        }
    }

    useEffect(() => {
        refreshData()
    }, [])

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
        sorting,
        columnFilters,
        columnVisibility,
        rowSelection,
        },
        meta: {
        refreshData: refreshData,
        },
    })

    if (loading) {
        return <div className="flex items-center justify-center h-64">Loading...</div>
    }

    return (
        <div className="w-full">
        <div className="flex items-center justify-between py-4">
            <Input
            placeholder="Filter nama..."
            value={(table.getColumn('nama')?.getFilterValue() as string) ?? ''}
            onChange={(event) =>
                table.getColumn('nama')?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
            />
            <div className="flex gap-2">
            <CreateUserDialog onSuccess={refreshData} />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                    Columns <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                {table
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => {
                    return (
                        <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                            column.toggleVisibility(!!value)
                        }
                        >
                        {column.id}
                        </DropdownMenuCheckboxItem>
                    )
                    })}
                </DropdownMenuContent>
            </DropdownMenu>
            </div>
        </div>
        <div className="rounded-md border">
            <Table>
            <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                    return (
                        <TableHead key={header.id} style={{ width: header.getSize() }}>
                        {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                            )}
                        </TableHead>
                    )
                    })}
                </TableRow>
                ))}
            </TableHeader>
            <TableBody>
                {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                    <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    >
                    {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} style={{ width: cell.column.getSize() }}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                    ))}
                    </TableRow>
                ))
                ) : (
                <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                    Tidak ada data pengguna.
                    </TableCell>
                </TableRow>
                )}
            </TableBody>
            </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} dari{' '}
            {table.getFilteredRowModel().rows.length} baris dipilih.
            </div>
            <div className="space-x-2">
            <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
            >
                Sebelumnya
            </Button>
            <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
            >
                Selanjutnya
            </Button>
            </div>
        </div>
        </div>
    )
}
