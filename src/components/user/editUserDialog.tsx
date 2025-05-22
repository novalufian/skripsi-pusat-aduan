'use client'

import { Pencil } from 'lucide-react'
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
import { useState, useEffect } from 'react'
import { toast } from 'sonner'

export type User = {
    id: number
    nama: string
    alamat: string
    tempatLahir: string
    tanggalLahir: string // This will store the date string from the input
}

type EditUserDialogProps = {
    user: User
    onSuccess: () => void
    children?: React.ReactNode
}

export function EditUserDialog({ user, onSuccess, children }: EditUserDialogProps) {
    const [open, setOpen] = useState(false)
    const [formData, setFormData] = useState({
        nama: '',
        alamat: '',
        tempatLahir: '',
        tanggalLahir: '',
    })
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        if (open) {
            // When the dialog opens, populate the form with user data
            setFormData({
                nama: user.nama,
                alamat: user.alamat,
                tempatLahir: user.tempatLahir,
                // Format the date for the input type="date"
                tanggalLahir: user.tanggalLahir ? new Date(user.tanggalLahir).toISOString().split('T')[0] : '',
            })
        }
    }, [open, user])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Basic client-side validation
        if (
            !formData.nama ||
            !formData.alamat ||
            !formData.tempatLahir ||
            !formData.tanggalLahir
        ) {
            toast.error('Semua bidang harus diisi, termasuk Nama, Alamat, Tempat Lahir, dan Tanggal Lahir.')
            return
        }

        setIsSubmitting(true)

        try {
            // Prepare data for the API.
            // Convert tanggalLahir to an ISO 8601 string, which DateTime expects.
            const dataToSend = {
                ...formData,
                tanggalLahir: new Date(formData.tanggalLahir).toISOString(),
            };

            const response = await fetch(`/api/users/${user.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
            })

            if (response.ok) {
                toast.success('Pengguna berhasil diperbarui')
                setOpen(false)
                onSuccess()
            } else {
                const errorData = await response.json()
                toast.error(errorData.error || 'Gagal memperbarui pengguna')
            }
        } catch (error: unknown) {
            console.error('Error submitting form:', error)
            toast.error('Terjadi kesalahan')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children || (
                    <Button variant="ghost" size="sm">
                        <Pencil className="h-4 w-4" />
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Edit Pengguna</DialogTitle>
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
                            <Label htmlFor="alamat" className="text-right">
                                Alamat
                            </Label>
                            <Input
                                id="alamat"
                                name="alamat"
                                value={formData.alamat}
                                onChange={handleInputChange}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="tempatLahir" className="text-right">
                                Tempat Lahir
                            </Label>
                            <Input
                                id="tempatLahir"
                                name="tempatLahir"
                                value={formData.tempatLahir}
                                onChange={handleInputChange}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="tanggalLahir" className="text-right">
                                Tanggal Lahir
                            </Label>
                            <Input
                                id="tanggalLahir"
                                name="tanggalLahir"
                                type="date"
                                value={formData.tanggalLahir}
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
                            onClick={() => setOpen(false)}
                            disabled={isSubmitting}
                        >
                            Batal
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}