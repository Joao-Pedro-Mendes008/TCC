"use client"
import { useState, useContext } from "react";
import supabase from "@/../utils/supabase/client";
import { UserPlus, Save } from 'lucide-react';
import "@/styles/components/adicionarPaciente.css";
import { SessionContext } from "@/context/sessionContext";


export default function AdicionarPaciente({ aoSalvar }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome_completo: "",
    email: "",
    telefone: "",
    cpf: "",
    endereco: ""
  });

  const {session} = useContext(SessionContext);

  const idConsultorioLogado = session?.user.id;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
        const { data: usuariosEncontrados, error: erroBusca } = await supabase
            .from('usuarios')
            .select('id')
            .or(`email.eq.${formData.email},cpf.eq.${formData.cpf}`);

        if (erroBusca) throw erroBusca;

        let usuarioId = null;
        if (usuariosEncontrados && usuariosEncontrados.length > 0) {
            usuarioId = usuariosEncontrados[0].id;
        }

        if (!usuarioId) {
            const { data: dadosInseridos, error: erroCriacao } = await supabase
                .from('usuarios')
                .insert([{ ...formData }])
                .select('id');

            if (erroCriacao) throw erroCriacao;
            
            if (dadosInseridos && dadosInseridos.length > 0) {
                usuarioId = dadosInseridos[0].id;
            } else {
                throw new Error("Usuário criado, mas não foi possível recuperar o ID (verifique as políticas RLS).");
            }
        }

        const { error: erroVinculo } = await supabase
            .from('consultorios_usuarios')
            .upsert({
                consultorio_id: idConsultorioLogado,
                usuario_id: usuarioId
            }, { 
                onConflict: 'consultorio_id, usuario_id'
            });

        if (erroVinculo) throw erroVinculo;

        alert("Paciente vinculado/criado com sucesso!");
        setFormData({ nome_completo: "", email: "", telefone: "", cpf: "", endereco: "" });
        if (aoSalvar) aoSalvar();

    } catch (error) {
        console.error(error);
        alert("Erro: " + error.message);
    } finally {
        setLoading(false);
    }
};

  return (
    <div className="container-adicionar">
      <div className="header">
        <UserPlus size={24} />
        <h2 className="titulo">Novo Paciente</h2>
      </div>

      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label className="label">Nome Completo</label>
          <input
            required
            type="text"
            name="nome_completo"
            value={formData.nome_completo}
            onChange={handleChange}
            className="input-field"
            placeholder="Ex: João da Silva"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="label">Email</label>
            <input
              required
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input-field"
              placeholder="joao@email.com"
            />
          </div>
          <div className="form-group">
            <label className="label">Telefone</label>
            <input
              type="text"
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
              className="input-field"
              placeholder="(11) 99999-9999"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="label">CPF</label>
            <input
              type="text"
              name="cpf"
              value={formData.cpf}
              onChange={handleChange}
              className="input-field"
              placeholder="000.000.000-00"
            />
          </div>
          <div className="form-group">
            <label className="label">Endereço (Opcional)</label>
            <input
              type="text"
              name="endereco"
              value={formData.endereco}
              onChange={handleChange}
              className="input-field"
              placeholder="Rua, Número..."
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-salvar"
        >
          {loading ? "Salvando..." : (
            <>
              <Save size={20} /> Salvar Paciente
            </>
          )}
        </button>
      </form>
    </div>
  );
}