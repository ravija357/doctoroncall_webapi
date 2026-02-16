import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/context/AuthContext";

const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(["user", "doctor"]),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export function useLoginForm() {
    const { login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            role: "user"
        }
    });

    const currentRole = form.watch("role");

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
