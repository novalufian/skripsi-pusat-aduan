    "use client"

    import * as React from "react"
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
} from "@tanstack/react-table"
import { ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useEffect, useState } from "react"
import { CreateAduanDialog } from "@/components/aduan/createAduanDialog"
import { EditAduanDialog } from "@/components/aduan/editAduanDialog"
import { DeleteConfirmationDialog } from "@/components/aduan/deleteAduanDialog"

export type Aduan = {
    id: number
    judul: string
    deskripsi: string
    disposisi: string
    createdAt: string
    updatedAt: string
}

export default function DataTableAduan() {
    const [data, setData] = useState<Aduan[]>([])
    const [loading, setLoading] = useState(true)
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})


    const columns: ColumnDef<Aduan>[] = [
        {
            id: "select",
            header: ({ table }) => (
            <Checkbox
                checked={
                table.getIsAllPageRowsSelected() ||
                (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value: boolean) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
            ),
            cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value: boolean) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
            ),
            enableSorting: false,
            enableHiding: false,
            size: 40,
        },
        {
            accessorKey: "judul",
            header: "Judul",
            cell: ({ row }) => (
            <div className="w-[200px] truncate" title={row.getValue("judul")}>
                {row.getValue("judul")}
            </div>
            ),
            size: 200,
        },
        {
            accessorKey: "deskripsi",
            header: "Deskripsi",
            cell: ({ row }) => (
            <div className="w-[300px] truncate" title={row.getValue("deskripsi")}>
                {row.getValue("deskripsi")}
            </div>
            ),
            size: 300,
        },
        {
            accessorKey: "disposisi",
            header: "Disposisi",
            cell: ({ row }) => (
            <div className="w-[200px] truncate" title={row.getValue("disposisi")}>
                {row.getValue("disposisi") || '-'}
            </div>
            ),
            size: 200,
        },
        {
            accessorKey: "createdAt",
            header: "Dibuat Pada",
            cell: ({ row }) => (
            <div className="w-[150px]">
                {new Date(row.getValue("createdAt")).toLocaleString()}
            </div>
            ),
            size: 150,
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
            const aduan = row.original

            return (
                <div className="flex gap-2">
                <EditAduanDialog aduan={aduan} onSuccess={()=>{
                    refreshData()
                }} />
                <DeleteConfirmationDialog
                    id={aduan.id}
                    onSuccess={refreshData}
                />
                </div>
            )
            },
            size: 120,
        },
    ]

    useEffect(() => {
        const fetchData = async () => {
        try {
            const response = await fetch('/api/aduan')
            const result = await response.json()
            setData(result)
        } catch (error) {
            console.error('Error fetching data:', error)
        } finally {
            setLoading(false)
        }
        }

        fetchData()
    }, [])

    const refreshData = async () => {
        try {
        const response = await fetch('/api/aduan')
        const result = await response.json()
        setData(result)
        } catch (error) {
        console.error('Error refreshing data:', error)
        }
    }

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
    })

    if (loading) {
        return <div className="flex items-center justify-center h-64">Loading...</div>
    }

    return (
        <div className="w-full">
        <div className="flex items-center justify-between py-4">
            <Input
            placeholder="Filter judul..."
            value={(table.getColumn("judul")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
                table.getColumn("judul")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
            />
            <div className="flex gap-2">
            <CreateAduanDialog onSuccess={refreshData} />
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
                        <TableHead
                        key={header.id}
                        style={{ width: header.getSize() }}
                        >
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
                    data-state={row.getIsSelected() && "selected"}
                    >
                    {row.getVisibleCells().map((cell) => (
                        <TableCell
                        key={cell.id}
                        style={{ width: cell.column.getSize() }}
                        >
                        {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                        )}
                        </TableCell>
                    ))}
                    </TableRow>
                ))
                ) : (
                <TableRow>
                    <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                    >
                    Tidak ada data.
                    </TableCell>
                </TableRow>
                )}
            </TableBody>
            </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} dari{" "}
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
