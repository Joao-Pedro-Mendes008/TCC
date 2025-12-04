"use client";

import { useState, useContext } from "react";
import { SessionContext } from "@/context/sessionContext";
import supabase from "@/../utils/supabase/client";
import { PlusCircle, Stethoscope, DollarSign } from "lucide-react";
import "@/styles/consultorio.css";

export default function AdicionarProcedimento({ aoSalvar }) {
    const { session } = useContext(SessionContext);
    const [loading, setLoading] = useState(false);
    const [nome, setNome] = useState("");
    const [preco, setPreco] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!session?.user) return;
        
        if (!nome) {
            alert("Digite o nome do procedimento!");
            return;
        }

        setLoading(true);

        try {
            const { error } = await supabase
                .from('procedimentos')
                .insert({
                    id_consultorio: session.user.id,
                    nome_procedimento: nome,
                    preco: Number(preco) || null
                });

            if (error) throw error;

            alert("Procedimento cadastrado com sucesso!");
            setNome("");
            setPreco("");
            
            if (aoSalvar) aoSalvar();

        } catch (error) {
            console.error("Erro:", error);
            alert("Erro ao cadastrar procedimento.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card-maior" style={{ marginTop: '20px' }}>
            <h4 className="titulo-secao">Novo Procedimento</h4>
            
            <form onSubmit={handleSubmit} className="form-consulta" style={{width: '100%'}}>
                
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label className="label-busca" style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Stethoscope size={16} color="#0c9ee2"/> Nome do Procedimento
                    </label>
                    <input 
                        type="text" 
                        className="input-padrao" 
                        placeholder="Ex: Limpeza, Consulta de Rotina..."
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        required
                    />
                </div>

                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label className="label-busca" style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <DollarSign size={16} color="#0c9ee2"/> Valor (R$)
                    </label>
                    <input 
                        type="number" 
                        className="input-padrao" 
                        placeholder="0.00"
                        value={preco}
                        onChange={(e) => setPreco(e.target.value)}
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    style={{
                        marginTop: '10px',
                        width: '100%',
                        height: '48px',
                        backgroundColor: '#0c9ee2',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        fontSize: '1rem',
                        fontWeight: '500',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        fontFamily: 'Google Sans Flex, sans-serif'
                    }}
                >
                    {loading ? "Salvando..." : "Cadastrar"}
                    {!loading && <PlusCircle size={18} />}
                </button>

            </form>
        </div>
    );
}