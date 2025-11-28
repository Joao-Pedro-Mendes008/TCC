"use client"
import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Mail, ArrowLeft } from 'lucide-react';
import { useRouter } from "next/navigation";
import "@/styles/components/recover.css";

export default function RecoverPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [enviado, setEnviado] = useState(false);
    const [erro, setErro] = useState(null);
    const router = useRouter();
    const supabase = createClientComponentClient();

    const handleEnviarEmail = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErro(null);

        try {
            const origin = window.location.origin;

            // MUDANÇA: Removemos o '/callback' e apontamos direto para a página final
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${origin}/recover/redefinirSenha`,
            });

            if (error) throw error;
            setEnviado(true);

        } catch (error) {
            setErro(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="recuperar-container">
            <div className="card-recuperar">
                <h1 className="titulo-recuperar">Recuperar Acesso</h1>

                {!enviado ? (
                    <>
                        <p className="texto-instrucao">
                            Digite o e-mail associado à sua conta e enviaremos um link para redefinir sua senha.
                        </p>

                        <form onSubmit={handleEnviarEmail} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                            <input
                                type="email"
                                className="input-email"
                                placeholder="seu@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />

                            {erro && <div style={{ color: '#d32f2f', fontSize: '14px', textAlign: 'center', width: '60%' }}>{erro}</div>}

                            <button type="submit" className="btn-enviar-link" disabled={loading}>
                                <Mail size={18} />
                                {loading ? "Enviando..." : "Enviar Link"}
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="sucesso-msg">
                        <p><strong>E-mail enviado!</strong></p>
                        <p>Verifique sua caixa de entrada e clique no link.</p>
                    </div>
                )}

                <button onClick={() => router.push('/login')} className="btn-voltar">
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px', justifyContent: 'center' }}>
                        <ArrowLeft size={14} /> Voltar para Login
                    </span>
                </button>
            </div>
        </div>
    );
}