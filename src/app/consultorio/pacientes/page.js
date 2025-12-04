"use client";

import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { SessionContext } from "@/context/sessionContext";
import supabase from "@/../utils/supabase/client";
import NavBar from "@/components/ui/nav";
import Container from "@/components/ui/container";
import { Search, User, Phone, Mail, FileText, Plus, X } from "lucide-react";
import "@/styles/pacientes.css";

export default function MeusPacientes() {
    const { session } = useContext(SessionContext);
    const router = useRouter();

    const [pacientes, setPacientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [termoBusca, setTermoBusca] = useState("");

    useEffect(() => {
        const fetchPacientes = async () => {
            if (!session?.user) return;
            setLoading(true);

            let query = supabase
                .from('usuarios')
                .select(`
                    *,
                    consultorios_usuarios!inner (
                        consultorio_id
                    )
                `)
                .eq('consultorios_usuarios.consultorio_id', session.user.id);

            if (termoBusca.length > 0) {
                query = query.ilike('nome_completo', `${termoBusca}%`);
            }
            query = query.order('nome_completo', { ascending: true });

            const { data, error } = await query;

            if (error) {
                console.error("Erro ao buscar pacientes:", error);
            } else {
                setPacientes(data || []);
            }
            setLoading(false);
        };

        const delayDebounceFn = setTimeout(() => {
            fetchPacientes();
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [session, termoBusca]);

    return (
        <div>
            <NavBar />
            <Container>
                
                <div className="page-header">
                    <div className="header-title">
                        <h2>Meus Pacientes</h2>
                        <span className="badge-count">{pacientes.length} cadastrados</span>
                    </div>

                    <div className="header-actions">
                        <div className="search-wrapper">
                            <Search className="search-icon" size={20} />
                            <input 
                                type="text" 
                                placeholder="Buscar por nome..." 
                                value={termoBusca}
                                onChange={(e) => setTermoBusca(e.target.value)}
                            />
                            {termoBusca && (
                                <button className="btn-clear" onClick={() => setTermoBusca("")}>
                                    <X size={16} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="pacientes-grid">
                    {loading ? (
                        <p className="loading-text">Carregando lista...</p>
                    ) : pacientes.length === 0 ? (
                        <div className="empty-state">
                            <User size={48} color="#ccc" />
                            <p>
                                {termoBusca 
                                    ? `Nenhum paciente encontrado com "${termoBusca}".` 
                                    : "Nenhum paciente vinculado ao seu consultório ainda."}
                            </p>
                        </div>
                    ) : (
                        pacientes.map((p) => (
                            <div key={p.id} className="paciente-card">
                                <div className="card-header-paciente">
                                    <div className="avatar-circle">
                                        {p.avatar_url ? (
                                            <img src={p.avatar_url} alt={p.nome_completo} />
                                        ) : (
                                            <span className="initials">
                                                {p.nome_completo?.charAt(0).toUpperCase() || "U"}
                                            </span>
                                        )}
                                    </div>
                                    <div className="header-info">
                                        <h3>{p.nome_completo}</h3>
                                        <span className="cpf-text">{p.cpf || "CPF não informado"}</span>
                                    </div>
                                </div>

                                <div className="card-body-paciente">
                                    <div className="info-row">
                                        <Phone size={16} className="icon-gray" />
                                        <span>{p.telefone || "Sem telefone"}</span>
                                    </div>
                                    <div className="info-row">
                                        <Mail size={16} className="icon-gray" />
                                        <span className="email-text">{p.email || "Sem e-mail"}</span>
                                    </div>
                                </div>

                                <div className="card-footer-paciente">
                                    <button 
                                        className="btn-ver-ficha"
                                        onClick={() => router.push(`/consultorio/pacientes/${p.id}`)}
                                    >
                                        <FileText size={16} />
                                        Ver Ficha
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

            </Container>
        </div>
    );
}