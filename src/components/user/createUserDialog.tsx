// components/users/CreateUserDialog.tsx
'use client'

import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { toast } from 'sonner'


type CreateUserDialogProps = {
    onSuccess: () => void
    onCancel?: () => void
    children?: React.ReactNode
}

export function CreateUserDialog({ onSuccess, onCancel, children }: CreateUserDialogProps) {
    const [open, setOpen] = useState(false)
    const [formData, setFormData] = useState({
        nama: '',
        email: '',
        password: '',
    })
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
        ...prev,
        [name]: value,
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.nama || !formData.email || !formData.password) {
        toast.error('Nama, email, dan password harus diisi')
        return
        }

        setIsSubmitting(true)

        try {
        const response = await fetch('/api/users', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })

        if (response.ok) {
            toast.success('Pengguna berhasil ditambahkan')
            setOpen(false)
            setFormData({
            nama: '',
            email: '',
            password: '',
            })
            onSuccess()
        } else {
            const errorData = await response.json()
            toast.error(errorData.error || 'Gagal menambahkan pengguna')
        }
        } catch (error : unknown) {
        console.error('Error submitting form:', error)
        toast.error('Terjadi kesalahan')
        } finally {
        setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={(isOpen) => {
        setOpen(isOpen)
        if (!isOpen) onCancel?.()
        }}>
        <DialogTrigger asChild>
            {children || (
            <Button>
                <Plus className="mr-2 h-4 w-4" />
                Tambah Pengguna
            </Button>
            )}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
            <DialogTitle>Tambah Pengguna Baru</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="nama" className="text-right">
                    Nama
                </Label>
                <Input
                    id="nama"
                    name="nama"
                    value={formData.nama}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                    Email
                </Label>
                <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right">
                    Password
                </Label>
                <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                />
                </div>

            </div>
            <div className="flex justify-end gap-2">
                <Button
                type="button"
                variant="outline"
                onClick={() => {
                    setOpen(false)
                    onCancel?.()
                }}
                disabled={isSubmitting}
                >
                Batal
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                </Button>
            </div>
            </form>
        </DialogContent>
        </Dialog>
    )
}
