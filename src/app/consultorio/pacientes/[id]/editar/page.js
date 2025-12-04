"use client";

import { useEffect, useState, useContext } from "react";
import { useRouter, useParams } from "next/navigation";
import { SessionContext } from "@/context/sessionContext";
import supabase from "@/../utils/supabase/client";
import NavBar from "@/components/ui/nav";
import Container from "@/components/ui/container";
import BotaoVoltar from "@/components/ui/botaoVoltar";
import { Save, User, Phone, Mail, MapPin, FileText } from "lucide-react";
import "@/styles/editar-paciente.css";

export default function EditarPaciente() {
    const { id } = useParams();
    const { session } = useContext(SessionContext);
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    
    const [formData, setFormData] = useState({
        nome_completo: "",
        cpf: "",
        telefone: "",
        email: "",
        endereco: ""
    });

    useEffect(() => {
        const fetchPaciente = async () => {
            if (!session?.user || !id) return;

            const { data, error } = await supabase
                .from('usuarios')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                console.error("Erro ao buscar paciente:", error);
                alert("Erro ao carregar dados do paciente.");
                router.back();
            } else {
                setFormData({
                    nome_completo: data.nome_completo || "",
                    cpf: data.cpf || "",
                    telefone: data.telefone || "",
                    email: data.email || "",
                    endereco: data.endereco || ""
                });
            }
            setLoading(false);
        };

        fetchPaciente();
    }, [id, session, router]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const { error } = await supabase
                .from('usuarios')
                .update({
                    nome_completo: formData.nome_completo,
                    cpf: formData.cpf,
                    telefone: formData.telefone,
                    email: formData.email,
                    endereco: formData.endereco
                })
                .eq('id', id);

            if (error) throw error;

            alert("Dados atualizados com sucesso!");
            router.push(`/consultorio/pacientes/${id}`);
            router.refresh();

        } catch (error) {
            console.error("Erro ao salvar:", error);
            alert("Erro ao atualizar dados: " + error.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="loading-container">Carregando dados...</div>;

    return (
        <div>
            <NavBar />
            <Container>
                <form onSubmit={handleSave} className="edit-patient-container">
                    
                    <div className="edit-header">
                        <h2>Editar Dados do Paciente</h2>
                        <p>Atualize as informações cadastrais abaixo.</p>
                    </div>

                    <div className="form-card">
                        
                        <div className="input-group full-width">
                            <label><User size={16} /> Nome Completo</label>
                            <input 
                                type="text" 
                                name="nome_completo" 
                                value={formData.nome_completo} 
                                onChange={handleChange}
                                placeholder="Nome do paciente"
                            />
                        </div>

                        <div className="row-inputs">
                            <div className="input-group">
                                <label><FileText size={16} /> CPF</label>
                                <input 
                                    type="text" 
                                    name="cpf" 
                                    value={formData.cpf} 
                                    onChange={handleChange}
                                    placeholder="000.000.000-00"
                                />
                            </div>
                            <div className="input-group">
                                <label><Phone size={16} /> Telefone</label>
                                <input 
                                    type="text" 
                                    name="telefone" 
                                    value={formData.telefone} 
                                    onChange={handleChange}
                                    placeholder="(00) 00000-0000"
                                />
                            </div>
                        </div>

                        <div className="input-group full-width">
                            <label><Mail size={16} /> Email</label>
                            <input 
                                type="email" 
                                name="email" 
                                value={formData.email} 
                                onChange={handleChange}
                                placeholder="email@exemplo.com"
                            />
                        </div>

                        <div className="input-group full-width">
                            <label><MapPin size={16} /> Endereço Completo</label>
                            <textarea 
                                name="endereco" 
                                value={formData.endereco} 
                                onChange={handleChange}
                                rows="3"
                                placeholder="Rua, Número, Bairro, Cidade..."
                            />
                        </div>

                    </div>

                    <div className="form-actions">
                        <BotaoVoltar />
                        <button type="submit" className="btn-save" disabled={saving}>
                            {saving ? "Salvando..." : "Salvar Alterações"} <Save size={18} />
                        </button>
                    </div>

                </form>
            </Container>
        </div>
    );
}