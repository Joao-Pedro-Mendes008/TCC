"use client"
import { useState, useEffect } from "react"; // Adicione useEffect
import { useRouter, useSearchParams } from "next/navigation"; // Adicione useSearchParams
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Eye, EyeOff } from 'lucide-react';
import "@/styles/RedefinirSenha.css";

export default function RedefinirSenhaPage() {
    const router = useRouter();
    const searchParams = useSearchParams(); // Para ler o código da URL
    const supabase = createClientComponentClient();
    
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState(null);
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [sessaoRecuperada, setSessaoRecuperada] = useState(false); // Novo estado

    // --- NOVO: Efeito para processar o Código do Email ---
    useEffect(() => {
        const recuperarSessao = async () => {
            // Verifica se tem o código na URL (ex: ?code=xxxxxx)
            const code = searchParams.get('code');
            
            if (code) {
                // Troca o código pela sessão do usuário
                const { error } = await supabase.auth.exchangeCodeForSession(code);
                if (error) {
                    setErro("Link inválido ou expirado. Tente solicitar novamente.");
                } else {
                    setSessaoRecuperada(true); // Sucesso! Usuário está logado
                }
            }
        };

        recuperarSessao();
    }, [searchParams, supabase]);

    const handleRedefinir = async (e) => {
        e.preventDefault();
        setErro(null);

        if (senha.length < 6) {
            setErro("A senha deve ter pelo menos 6 caracteres.");
            return;
        }

        if (senha !== confirmarSenha) {
            setErro("As senhas não coincidem.");
            return;
        }

        setLoading(true);

        try {
            // O comando updateUser só funciona se o useEffect acima tiver funcionado
            const { error } = await supabase.auth.updateUser({
                password: senha
            });

            if (error) throw error;

            alert("Sua senha foi atualizada com sucesso!");
            router.push("/login"); 
        } catch (error) {
            setErro("Erro ao atualizar: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="redefinir-container">
            <div className="card-redefinir">
                <h1 className="titulo-redefinir">Nova Senha</h1>
                <p className="subtitulo">Digite sua nova senha abaixo.</p>

                {erro && <div className="erro-msg">{erro}</div>}

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
                        {loading ? "Atualizando..." : "Salvar Senha"}
                    </button>
                </form>
            </div>
        </div>
    );
}