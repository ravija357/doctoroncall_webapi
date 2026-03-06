import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/context/AuthContext";
import { useRole } from "@/context/RoleContext";

const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(["user", "doctor", "admin"]),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export function useLoginForm() {
    const { login } = useAuth();
    const { role: contextRole } = useRole();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            role: contextRole === 'doctor' ? 'doctor' : contextRole === 'admin' ? 'admin' : 'user'
        }
    });

    const currentRole = form.watch("role");

    const hasSynced = useRef(false);

    // Sync role from context on first render only.
    // Using a ref guard so the dep array stays stable and never overrides
    // a manually chosen admin role.
    useEffect(() => {
        if (!hasSynced.current && contextRole && form.getValues('role') !== 'admin') {
            form.setValue('role', contextRole === 'doctor' ? 'doctor' : 'user');
            hasSynced.current = true;
        }
    }, [contextRole, form]);

    const onSubmit = async (data: LoginFormValues) => {
        setIsLoading(true);
        setError("");
        try {
            await login(data);
        } catch (err: any) {
            setError(err.response?.data?.message || "Invalid credentials. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return {
        form,
        isLoading,
        error,
        currentRole,
        onSubmit: form.handleSubmit(onSubmit),
    };
}
