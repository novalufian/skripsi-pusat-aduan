// components/aduan/CreateAduanDialog.tsx
"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

type DisposisiOption = {
    disposisi: string
    count: number
}

type CreateAduanDialogProps = {
    onSuccess: () => void
}

export function CreateAduanDialog({ onSuccess }: CreateAduanDialogProps) {
    const [open, setOpen] = useState(false)
    const [formData, setFormData] = useState({
        judul: '',
        deskripsi: '',
        disposisi: ''
    })
    const [disposisiOptions, setDisposisiOptions] = useState<DisposisiOption[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isLoadingOptions, setIsLoadingOptions] = useState(false)

    useEffect(() => {
        if (open) {
        fetchDisposisiOptions()
        }
    }, [open])

    const fetchDisposisiOptions = async () => {
        setIsLoadingOptions(true)
        try {
        const response = await fetch('/api/aduan/disposisi-count')
        const data = await response.json()
        setDisposisiOptions(data)
        } catch (error) {
        console.error('Error fetching disposisi options:', error)
        toast.error('Gagal memuat daftar disposisi')
        } finally {
        setIsLoadingOptions(false)
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
        ...prev,
        [name]: value
        }))
    }

    const handleSelectChange = (value: string) => {
        setFormData(prev => ({
        ...prev,
        disposisi: value
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.judul.trim() || !formData.deskripsi.trim()) {
        toast.error('Judul dan deskripsi harus diisi')
        return
        }

        setIsSubmitting(true)

        try {
        const response = await fetch('/api/aduan', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })

        if (response.ok) {
            toast.success('Aduan berhasil ditambahkan')
            setOpen(false)
            setFormData({ judul: '', deskripsi: '', disposisi: '' })
            onSuccess()
        } else {
            const errorData = await response.json()
            toast.error(errorData.error || 'Gagal menambahkan aduan')
        }
        } catch (error) {
        toast.error('Terjadi kesalahan')
        console.error('Error:', error)
        } finally {
        setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
            <Button>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Aduan Baru
            </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
            <DialogTitle>Tambah Aduan Baru</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="judul" className="text-right">
                    Judul
                </Label>
                <Input
                    id="judul"
                    name="judul"
                    value={formData.judul}
                    onChange={handleInputChange}
                    className="col-span-3"
                    disabled={isSubmitting}
                    required
                />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="deskripsi" className="text-right">
                    Deskripsi
                </Label>
                <Textarea
                    id="deskripsi"
                    name="deskripsi"
                    value={formData.deskripsi}
                    onChange={handleInputChange}
                    className="col-span-3"
                    rows={5}
                    disabled={isSubmitting}
                    required
                />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="disposisi" className="text-right">
                    Disposisi
                </Label>
                <Select 
                    onValueChange={handleSelectChange}
                    value={formData.disposisi}
                    disabled={isSubmitting || isLoadingOptions}
                >
                    <SelectTrigger className="col-span-3 w-full">
                    <SelectValue placeholder="Pilih disposisi (opsional)" />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="none">Tidak didisposisi</SelectItem>
                    {isLoadingOptions ? (
                        <SelectItem value="loading" disabled>Memuat daftar disposisi...</SelectItem>
                    ) : (
                        disposisiOptions.map((option) => (
                        <SelectItem 
                            key={option.disposisi} 
                            value={option.disposisi }
                        >
                            {option.disposisi} ({option.count})
                        </SelectItem>
                        ))
                    )}
                    </SelectContent>
                </Select>
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
                {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                </Button>
            </div>
            </form>
        </DialogContent>
        </Dialog>
    )
}
