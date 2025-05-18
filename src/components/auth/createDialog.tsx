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
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

type UserOption = {
    value: string;
    label: string;
}

type User = {
    id: number;
    nama: string;
}

type CreateDialogProps = {
    onSuccess: () => void;
    onCancel?: () => void;
    children?: React.ReactNode;
}

export function CreateDialog({ onSuccess, onCancel, children }: CreateDialogProps) {
    const [open, setOpen] = useState(false)
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        userId: '',
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [userOptions, setUserOptions] = useState<UserOption[]>([])
    const [isLoadingUsers, setIsLoadingUsers] = useState(false)
    const [userFetchError, setUserFetchError] = useState<string | null>(null)



    // Fetch users when dialog opens
    useEffect(() => {
        const fetchUsers = async () => {
            if (!open) {
                setUserOptions([])
                setUserFetchError(null)
                return
            }

            setIsLoadingUsers(true)
            setUserFetchError(null)

            try {
                const response = await fetch('/api/users/nologin')
                if (!response.ok) {
                    throw new Error('Failed to fetch users')
                }

                const users: User[] = await response.json()
                const options = users.map(user => ({
                    value: String(user.id), // Ensure consistent string type
                    label: user.nama,
                }))

                setUserOptions(options)
            } catch (error) {
                console.error('Error fetching users:', error)
                setUserFetchError(error instanceof Error ? error.message : 'Failed to fetch users')
                toast.error('Gagal memuat daftar pengguna')
            } finally {
                setIsLoadingUsers(false)
            }
        }

        fetchUsers()
    }, [open])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleUserSelectChange = (value: string) => {
        setFormData(prev => ({
            ...prev,
            userId: value,
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.username || !formData.password || !formData.userId) {
            toast.error('Username, password, dan User ID harus diisi')
            return
        }

        setIsSubmitting(true)

        try {
            const response = await fetch('/api/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    userId: Number(formData.userId), // Convert to number if API expects it
                }),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Failed to create user')
            }

            toast.success('Pengguna berhasil ditambahkan')
            setOpen(false)
            setFormData({
                username: '',
                password: '',
                userId: '',
            })
            onSuccess()
        } catch (error) {
            console.error('Error creating user:', error)
            toast.error(error instanceof Error ? error.message : 'Terjadi kesalahan')
        } finally {
            setIsSubmitting(false)
        }
    }

    const closeDialogAndReset = () => {
        setOpen(false)
        setFormData({
            username: '',
            password: '',
            userId: '',
        })
        setUserOptions([])
        setUserFetchError(null)
        onCancel?.()
    }

    const getSelectPlaceholder = () => {
        if (isLoadingUsers) return "Loading users..."
        if (userFetchError) return userFetchError
        if (formData.userId) {
            const selectedUser = userOptions.find(user => user.value === formData.userId)
            return selectedUser ? selectedUser.label : "Pilih User ID"
        }
        return "Pilih User ID"
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
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
                            <Label htmlFor="username" className="text-right">
                                Username
                            </Label>
                            <Input
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                className="col-span-3"
                                required
                                disabled={isSubmitting}
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
                                disabled={isSubmitting}
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="userId" className="text-right">
                                User (No Login)
                            </Label>
                            <Select
                                value={formData.userId}
                                onValueChange={handleUserSelectChange}
                                disabled={isSubmitting || isLoadingUsers || !!userFetchError}
                                required
                            >
                                <SelectTrigger id="userId" className="col-span-3">
                                    <SelectValue placeholder={getSelectPlaceholder()} />
                                </SelectTrigger>
                                <SelectContent>
                                    {userOptions.map(user => (
                                        <SelectItem key={user.value} value={user.value}>
                                            {user.label}
                                        </SelectItem>
                                    ))}
                                    {!isLoadingUsers && userOptions.length === 0 && !userFetchError && (
                                        <SelectItem value="none" disabled>
                                            Tidak ada pengguna tersedia
                                        </SelectItem>
                                    )}
                                </SelectContent>
                            </Select>
                            {userFetchError && (
                                <p className="col-span-4 text-right text-sm text-red-500">
                                    {userFetchError}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={closeDialogAndReset}
                            disabled={isSubmitting}
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting || isLoadingUsers || !!userFetchError}
                        >
                            {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
