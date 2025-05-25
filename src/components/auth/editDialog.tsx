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
import { useState, useEffect, useRef } from 'react'
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

    const initialized = useRef(false);

    // Note: All API calls and state management now use userId instead of loginId
    useEffect(() => {
        let isMounted = true; // Track if component is still mounted
    
        const fetchData = async () => {
            if (open && !initialized.current) {
                // Initial data loading logic
                initialized.current = true;
            } else if (!open) {
                initialized.current = false;
            }

            if (!open) {
                if (isMounted) {
                    setUserOptions([]);
                    setError(null);
                }
                return;
            }
    
            setIsLoading(true);
            setError(null);
    
            try {
                const [authResponse, usersResponse] = await Promise.all([
                    fetch(`/api/auth/${loginId}`),
                    fetch('/api/users')
                ]);
    
                // Early return if unmounted
                if (!isMounted) return;
    
                if (!authResponse.ok) throw new Error('Failed to fetch user data');
                const authUser: AuthUser = await authResponse.json();
    
                if (!usersResponse.ok) throw new Error('Failed to fetch user options');
                const users: User[] = await usersResponse.json();
    
                // Only update state if still mounted
                if (isMounted) {
                    setUserOptions(users.map(user => ({
                        value: user.id,
                        label: user.nama,
                    })));
    
                    console.log(authUser, formData);
                    setFormData({
                        username: authUser.username,
                        password: '',
                        userId: authUser.userId.toString(),
                    });
                }
    
            } catch (err) {
                if (isMounted) {
                    console.error('Error fetching data:', err);
                    setError(err instanceof Error ? err.message : 'Failed to load data');
                    toast.error('Failed to load user data');
                }
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };
    
        fetchData();
    
        return () => {
            isMounted = false; // Cleanup function
        };
    }, [open, loginId]); // Keep loginId in dependencies if it can change // Using userId in dependency array

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleUserSelectChange = (value: string) => {
        console.log(!initialized.current)
        // if (!initialized.current) return;
        setFormData(prev => ({
            ...prev,
            userId: value,  // Using userId here
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        if (!formData.username || !formData.userId) {
            toast.error('Username and User ID are required');
            return;
        }
    
        setIsSubmitting(true);
    
        try {
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
    
            // First check if response is OK
            if (!response.ok) {
                // Try to parse error response, but handle case where it might not be JSON
                let errorMessage = 'Failed to update user';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorData.error || errorMessage;
                } catch (parseError) {
                    console.error('Failed to parse error response:', parseError);
                }
                throw new Error(errorMessage);
            }
    
            // Only try to parse JSON if response is OK
            const data = await response.json();
            console.log('API response:', data);
    
            toast.success('User updated successfully');
            setOpen(false);
            onSuccess();
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

    useEffect(() => {
        console.log("FormData updated:", formData);
    }, [formData]);
    
    useEffect(() => {
        console.log("UserOptions updated:", userOptions);
    }, [userOptions]);

    const getSelectPlaceholder = () => {
        if (isLoading) return "Loading data..."
        if (error) return error
    
        // Wait until userOptions are loaded before trying to find the selected user
        if (formData.userId && userOptions.length > 0) {
            const selectedUser = userOptions.find(user => user.value === formData.userId)
            if (!selectedUser) {
                return "User not found"
            }
            console.log("SELECT ",selectedUser.label)
            return selectedUser.label
        }
        
        // Default placeholder
        return "Select User ID"
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
                            <Label htmlFor="userId" className="text-right">
                                User ID
                            </Label>
                            <select
                                id="userId"
                                value={formData.userId}
                                onChange={(e) => {
                                setFormData(prev => ({
                                    ...prev,
                                    userId: e.target.value
                                }));
                                }}
                                disabled={isSubmitting || isLoading || !!error}
                                required
                                className="col-span-3 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                {isLoading ? (
                                <option value="">Loading data...</option>
                                ) : error ? (
                                <option value="">{error}</option>
                                ) : userOptions.length > 0 ? (
                                <>
                                    <option value="">Select User ID</option>
                                    {userOptions.map(user => (
                                    <option key={user.value} value={user.value}>
                                        {user.label}
                                    </option>
                                    ))}
                                </>
                                ) : (
                                <option value="">No options available</option>
                                )}
                            </select>
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
