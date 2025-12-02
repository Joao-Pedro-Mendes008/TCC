"use client"
import { useState, useEffect } from "react"; 
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Eye, EyeOff } from 'lucide-react';
import "@/styles/components/redefinirSenha.css";

export default function RedefinirSenhaPage() {
    const router = useRouter();
    const supabase = createClientComponentClient();
    
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [loading, setLoading] = useState(false);
    const [sessaoAtiva, setSessaoAtiva] = useState(false);
    const [verificando, setVerificando] = useState(true);
    const [mostrarSenha, setMostrarSenha] = useState(false);

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                setSessaoAtiva(true);
            }
            setVerificando(false);
        };
        checkSession();
    }, [supabase]);

    const handleRedefinir = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (senha.length < 6) {
             alert("A senha deve ter no mínimo 6 caracteres.");
             setLoading(false);
             return;
        }

        if (senha !== confirmarSenha) {
            alert("As senhas não coincidem.");
            setLoading(false);
            return;
        }

        try {
            const { error } = await supabase.auth.updateUser({
                password: senha
            });

            if (error) throw error;

            alert("Senha atualizada! Redirecionando...");
            router.push("/"); 

        } catch (error) {
            alert("Erro ao atualizar: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    if (verificando) return <div className="redefinir-container"><p>Carregando...</p></div>;

    if (!sessaoAtiva) return (
        <div className="redefinir-container">
            <div className="card-redefinir">
                <h2 style={{color:'red', textAlign: 'center'}}>Link Expirado</h2>
                <button 
                    onClick={() => router.push('/recover')} 
                    className="btn-salvar-senha"
                    style={{marginTop: '20px'}}
                >
                    Tentar novamente
                </button>
            </div>
        </div>
    );

    return (
        <div className="redefinir-container">
            <div className="card-redefinir">
                <h1 className="titulo-redefinir">Nova Senha</h1>
                <form onSubmit={handleRedefinir} className="form-redefinir">
                    <div className="password-group">
                        <input
                            type={mostrarSenha ? "text" : "password"}
                            className="input-senha"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            placeholder="Nova Senha"
                            required
                        />
                        <button
                            type="button"
                            className="btn-eye"
                            onClick={() => setMostrarSenha(!mostrarSenha)}
                        >
                            {mostrarSenha ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                    <div className="password-group">
                        <input
                            type="password"
                            className="input-senha"
                            value={confirmarSenha}
                            onChange={(e) => setConfirmarSenha(e.target.value)}
                            placeholder="Confirmar Senha"
                            required
                        />
                    </div>
                    <button type="submit" className="btn-salvar-senha" disabled={loading}>
                        {loading ? "Salvar..." : "Salvar Senha"}
                    </button>
                </form>
            </div>
        </div>
    );
}