// components/users/EditDialog.tsx
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

// Note: Changed back from loginId to userId in all type definitions
type UserOption = {
    value: string;
    label: string;
}

type User = {
    id: string;
    nama: string;
}

type AuthUser = {
    username: string;
    password: string;
    userId: string;  // Changed back from loginId to userId
}

type EditDialogProps = {
    loginId: string;  // Changed back from loginId to userId
    onSuccess: () => void;
    onCancel?: () => void;
    children?: React.ReactNode;
}

export function EditDialog({ loginId, onSuccess, onCancel, children }: EditDialogProps) {
    const [open, setOpen] = useState(false)
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        userId: '',  // Changed back from loginId to userId
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [userOptions, setUserOptions] = useState<UserOption[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Note: All API calls and state management now use userId instead of loginId
    useEffect(() => {
        const fetchData = async () => {
            if (!open) {
                setUserOptions([])
                setError(null)
                return
            }

            setIsLoading(true)
            setError(null)

            try {
                // Fetch both user data and options in parallel
                const [authResponse, usersResponse] = await Promise.all([
                    fetch(`/api/auth/${loginId}`),  // Using userId in API endpoint
                    fetch('/api/users')
                ])

                if (!authResponse.ok) throw new Error('Failed to fetch user data')
                const authUser: AuthUser = await authResponse.json()

                if (!usersResponse.ok) throw new Error('Failed to fetch user options')
                const users: User[] = await usersResponse.json()

                // Set both states together to maintain consistency
                setUserOptions(users.map(user => ({
                    value: user.id,
                    label: user.nama,
                })))

                setFormData({
                    username: authUser.username,
                    password: '', // Never pre-fill password for security
                    userId: authUser.userId,  // Using userId here
                })

                console.log(authUser, formData)

            } catch (err) {
                console.error('Error fetching data:', err)
                setError(err instanceof Error ? err.message : 'Failed to load data')
                toast.error('Failed to load user data')
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [open, loginId])  // Using userId in dependency array

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
            userId: value,  // Using userId here
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevent default form submission

        console.log('Submit triggered with data:', formData); // Debug log

        if (!formData.username || !formData.userId) {
            toast.error('Username and User ID are required');
            return;
        }

        setIsSubmitting(true);

        try {
            console.log('Making API call...'); // Debug log
            const response = await fetch(`/api/auth/${loginId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: formData.username,
                    ...(formData.password && { password: formData.password }),
                    userId: formData.userId,
                }),
            });

            const data = await response.json();
            console.log('API response:', data); // Debug log

            if (!response.ok) {
                throw new Error(data.error || 'Failed to update user');
            }

            toast.success('User updated successfully');
            setOpen(false);
            onSuccess(); // Call success callback
        } catch (error) {
            console.error('Error updating user:', error);
            toast.error(
                error instanceof Error
                    ? error.message
                    : 'An error occurred while updating user'
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    const closeDialogAndReset = () => {
        setOpen(false)
        onCancel?.()
    }

    const getSelectPlaceholder = () => {
        if (isLoading) return "Loading data..."
        if (error) return error

        if (formData.userId) {
            const selectedUser = userOptions.find(user => user.value === formData.userId)
            if (userOptions.length > 0 && !selectedUser) {
                return "User not found"
            }
            return selectedUser ? selectedUser.label : "Loading options..."
        }
        return "Select User ID"  // Using User ID instead of Login ID
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
                    <DialogTitle>Edit User</DialogTitle>
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
                                Password (Leave blank to keep current)
                            </Label>
                            <Input
                                id="password"
                                name="password"
                                type="text"
                                value={formData.password}
                                onChange={handleInputChange}
                                className="col-span-3"
                                disabled={isSubmitting}
                                placeholder="••••••••"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="userId" className="text-right">  {/* Using userId */}
                                User ID  {/* Using User ID */}
                            </Label>
                            <Select
                                value={formData.userId}
                                onValueChange={handleUserSelectChange}
                                disabled={isSubmitting || isLoading || !!error}
                                required
                            >
                                <SelectTrigger id="userId" className="col-span-3">  {/* Using userId */}
                                    <SelectValue placeholder={getSelectPlaceholder()} />
                                </SelectTrigger>
                                <SelectContent>
                                    {userOptions.length > 0 ? (
                                        userOptions.map(user => (
                                            <SelectItem key={user.value} value={user.value}>
                                                {user.label}
                                            </SelectItem>
                                        ))
                                    ) : (
                                        <SelectItem value="loading" disabled>
                                            {isLoading ? "Loading..." : "No options available"}
                                        </SelectItem>
                                    )}
                                </SelectContent>
                            </Select>
                            {error && (
                                <p className="col-span-4 text-right text-sm text-red-500">
                                    {error}
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
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting || isLoading || !!error}
                        >
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
