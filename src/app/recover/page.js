"use client"
import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import "@/styles/components/recover.css";

export default function RecoverPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const supabase = createClientComponentClient();

    const handleEnviarEmail = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const origin = window.location.origin;
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${origin}/auth/callback?next=/recover/redefinirSenha`,
            });

            if (error) throw error;
            alert("E-mail enviado! Verifique sua caixa de entrada.");

        } catch (error) {
            alert("Erro: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="recuperar-container">
            <div className="card-recuperar">
                <h1 className="titulo-recuperar">Recuperar Acesso</h1>
                <form onSubmit={handleEnviarEmail} style={{width: '100%', display:'flex', flexDirection:'column', gap:'1rem', alignItems:'center'}}>
                    <input 
                        type="email" 
                        className="input-email"
                        placeholder="seu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <button type="submit" className="btn-enviar-link" disabled={loading}>
                        {loading ? "Enviando..." : "Enviar Link"}
                    </button>
                </form>
            </div>
        </div>
    );
}