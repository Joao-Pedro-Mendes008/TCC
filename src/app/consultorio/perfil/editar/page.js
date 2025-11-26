"use client";

import { useEffect, useState, useContext, useRef } from "react";
import { useRouter } from "next/navigation";
import { SessionContext } from "@/context/sessionContext";
import supabase from "@/../utils/supabase/client";
import NavBar from "@/components/ui/nav";
import Container from "@/components/ui/container";
import { Camera, Save } from "lucide-react";
import "@/styles/editarPerfil.css";

export default function EditarPerfil() {
    const { session } = useContext(SessionContext);
    const router = useRouter();
    const fileInputRef = useRef(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        nome: "",
        telefone: "",
        especialidade: "",
        cnpj: "",
        endereco: "",
        avatar_url: ""
    });

    const [previewUrl, setPreviewUrl] = useState(null);
    const [novoArquivo, setNovoArquivo] = useState(null);

    useEffect(() => {
        const fetchDados = async () => {
            if (!session?.user) return;

            const { data } = await supabase
                .from('consultorios')
                .select('*')
                .eq('id', session.user.id)
                .single();

            if (data) {
                setFormData({
                    nome: data.nome || "",
                    telefone: data.telefone || "",
                    especialidade: data.especialidade || "",
                    cnpj: data.cnpj || "",
                    endereco: data.endereco || "",
                    avatar_url: data.avatar_url || ""
                });
                setPreviewUrl(data.avatar_url);
            }
            setLoading(false);
        };

        fetchDados();
    }, [session]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNovoArquivo(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            let finalAvatarUrl = formData.avatar_url;

            if (novoArquivo) {
                const fileExt = novoArquivo.name.split('.').pop();
                const fileName = `${session.user.id}-${Date.now()}.${fileExt}`;
                const filePath = `${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('avatars')
                    .upload(filePath, novoArquivo);

                if (uploadError) throw uploadError;

                const { data: publicUrlData } = supabase.storage
                    .from('avatars')
                    .getPublicUrl(filePath);

                finalAvatarUrl = publicUrlData.publicUrl;
            }

            const { error: updateError } = await supabase
                .from('consultorios')
                .update({
                    nome: formData.nome,
                    telefone: formData.telefone,
                    especialidade: formData.especialidade,
                    cnpj: formData.cnpj,
                    endereco: formData.endereco,
                    avatar_url: finalAvatarUrl
                })
                .eq('id', session.user.id);

            if (updateError) throw updateError;

            alert("Perfil atualizado com sucesso!");
            router.push('/consultorio/perfil');
            router.refresh();

        } catch (error) {
            console.log("ERRO COMPLETO:", error);
            alert("Erro: " + (error.message || error.error_description || JSON.stringify(error)));
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div>Carregando...</div>;

    return (
        <div>
            <NavBar />
            <Container>
                <form onSubmit={handleSave} className="edit-form">

                    <div className="header-edit">
                        <h2>Editar Perfil</h2>
                        <p>Atualize as informações do seu consultório</p>
                    </div>

                    <div className="avatar-upload-section">
                        <div
                            className="avatar-preview"
                            onClick={() => fileInputRef.current.click()}
                        >
                            {previewUrl ? (
                                <img src={previewUrl} alt="Preview" />
                            ) : (
                                <div className="avatar-placeholder"></div>
                            )}
                            <div className="overlay-edit">
                                <Camera color="white" />
                            </div>
                        </div>
                        <p className="upload-hint">Clique na foto para alterar</p>

                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={handleImageChange}
                        />
                    </div>

                    <div className="form-grid">

                        <div className="form-section">
                            <h3>Informações Básicas</h3>

                            <div className="input-group">
                                <label>Nome do Profissional / Consultório</label>
                                <input
                                    type="text"
                                    name="nome"
                                    value={formData.nome || ""}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="input-group">
                                <label>Telefone / WhatsApp</label>
                                <input
                                    type="text"
                                    name="telefone"
                                    value={formData.telefone || ""}
                                    onChange={handleChange}
                                    placeholder="(00) 00000-0000"
                                />
                            </div>
                        </div>

                        <div className="form-section">
                            <h3>Dados Profissionais</h3>

                            <div className="row-inputs">
                                <div className="input-group">
                                    <label>Especialidade</label>
                                    <input
                                        type="text"
                                        name="especialidade"
                                        value={formData.especialidade || ""}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="input-group">
                                    <label>CNPJ</label>
                                    <input
                                        type="text"
                                        name="cnpj"
                                        value={formData.cnpj || ""}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form-section full-width">
                            <h3>Localização</h3>
                            <div className="input-group">
                                <label>Endereço Completo</label>
                                <textarea
                                    name="endereco"
                                    value={formData.endereco || ""}
                                    onChange={handleChange}
                                    rows="3"
                                    placeholder="Rua, Número, Bairro, Cidade..."
                                ></textarea>
                            </div>
                        </div>

                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            className="btn-cancelar"
                            onClick={() => router.back()}
                            disabled={saving}
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            className="btn-salvar"
                            disabled={saving}
                        >
                            {saving ? "Salvando..." : "Salvar Alterações"}
                            <Save size={18} />
                        </button>
                    </div>

                </form>
            </Container>
        </div>
    );
}