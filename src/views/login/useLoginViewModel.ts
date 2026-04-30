"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function useLoginViewModel() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const signInWithEmail = async (email: string, password: string) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setErrorMessage(translateAuthError(error.message));
      setIsSubmitting(false);
      return;
    }

    router.push("/");
    router.refresh();
  };

  const signInWithGoogle = async () => {
    setErrorMessage(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setErrorMessage(translateAuthError(error.message));
    }
  };

  return {
    isSubmitting,
    errorMessage,
    signInWithEmail,
    signInWithGoogle,
  };
}

function translateAuthError(message: string): string {
  if (message.includes("Invalid login credentials")) {
    return "Email o contraseña incorrectos.";
  }
  if (message.includes("Email not confirmed")) {
    return "Confirma tu correo antes de ingresar.";
  }
  return "No pudimos iniciar sesión. Intenta de nuevo.";
}
