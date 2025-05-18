// components/aduan/DeleteConfirmationDialog.tsx
"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

export function DeleteConfirmationDialog({
    id,
    onSuccess,
    children,
}: {
    id: number
    onSuccess: () => void
    children?: React.ReactNode
}) {
    const [open, setOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async () => {
        setIsDeleting(true)
        try {
            const response = await fetch(`/api/aduan/${id}`, {
                method: 'DELETE'
            })

            if (response.ok) {
                toast.success('Aduan berhasil dihapus')
                setOpen(false)
                onSuccess()
            } else {
                toast.error('Gagal menghapus aduan')
            }
        } catch (error : unknown) {
            console.error('Error deleting aduan:', error)
            toast.error('Terjadi kesalahan')
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
            {children || (
            <Button variant="ghost" size="sm">
                <Trash2 className="h-4 w-4" />
            </Button>
            )}
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
            <DialogTitle>Konfirmasi Penghapusan</DialogTitle>
            </DialogHeader>
            <div className="py-4">
            Apakah Anda yakin ingin menghapus aduan ini?
            </div>
            <div className="flex justify-end gap-2">
            <Button
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isDeleting}
            >
                Batal
            </Button>
            <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
            >
                {isDeleting ? 'Menghapus...' : 'Hapus'}
            </Button>
            </div>
        </DialogContent>
        </Dialog>
    )
}
