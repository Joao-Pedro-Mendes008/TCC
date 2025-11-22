"use client";

import { signUpPacientes } from "../../../hooks/useAuth";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import "../../../styles/login.css";

export default function SignUpPage() {
    const router = useRouter();

    const initialFormState = {
        email: "",
        password: "",
        nome: "",
        telefone: "",
        data_nascimento: "",
        cpf: "",
        genero: "",
        endereco: "",
        numero: "",
        complemento: "",
        bairro: "",
        cidade: "",
        estado: "",
        cep: "",
    };

    const [form, setForm] = useState(initialFormState);

    const role = "paciente";

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value ?? "",
        }));
    };

    const validarCPF = (cpf) => {
        cpf = cpf.replace(/[^\d]/g, "");
        if (cpf.length !== 11) return false;
        if (/^(\d)\1+$/.test(cpf)) return false;
        let soma = 0,
            resto;
        for (let i = 1; i <= 9; i++) soma += parseInt(cpf[i - 1]) * (11 - i);
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf[9])) return false;
        soma = 0;
        for (let i = 1; i <= 10; i++) soma += parseInt(cpf[i - 1]) * (12 - i);
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        return resto === parseInt(cpf[10]);
    };

    const validarTelefone = (tel) => /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/.test(tel);
    const validarCEP = (cep) => /^\d{5}-?\d{3}$/.test(cep);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validarCPF(form.cpf)) {
            alert("CPF inválido.");
            return;
        }

        if (!validarTelefone(form.telefone)) {
            alert("Telefone inválido. Use o formato (XX) XXXXX-XXXX.");
            return;
        }

        if (!validarCEP(form.cep)) {
            alert("CEP inválido. Use o formato XXXXX-XXX.");
            return;
        }

        const result = await signUpPacientes({ ...form, role });

        if (result) {
            router.push("/verify");
            setForm(initialFormState);
        } else {
            alert("Erro ao cadastrar. Verifique os dados e tente novamente.");
        }
    };

    return (
        <div className="container">
            <div className="primaryText">Cadastro de Paciente</div>

            <form onSubmit={handleSubmit} className="formContainer">
                <input
                    name="email"
                    type="email"
                    placeholder="Email:"
                    value={form.email ?? ""}
                    onChange={handleChange}
                    required
                />
                <input
                    name="password"
                    type="password"
                    placeholder="Senha:"
                    value={form.password ?? ""}
                    onChange={handleChange}
                    required
                />
                <input
                    name="nome"
                    type="text"
                    placeholder="Nome completo:"
                    value={form.nome ?? ""}
                    onChange={handleChange}
                    required
                />
                <input
                    name="telefone"
                    type="text"
                    placeholder="Telefone (XX) XXXXX-XXXX:"
                    value={form.telefone ?? ""}
                    onChange={handleChange}
                    required
                />
                <input
                    name="data_nascimento"
                    type="date"
                    value={form.data_nascimento ?? ""}
                    onChange={handleChange}
                    required
                />
                <input
                    name="cpf"
                    type="text"
                    placeholder="CPF:"
                    value={form.cpf ?? ""}
                    onChange={handleChange}
                    required
                />
                <select
                    name="genero"
                    value={form.genero ?? ""}
                    onChange={handleChange}
                    required
                >
                    <option value="">Selecione o gênero</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Feminino">Feminino</option>
                    <option value="Outro">Outro</option>
                </select>
                <input
                    name="endereco"
                    type="text"
                    placeholder="Endereço:"
                    value={form.endereco ?? ""}
                    onChange={handleChange}
                    required
                />
                <input
                    name="numero"
                    type="text"
                    placeholder="Número:"
                    value={form.numero ?? ""}
                    onChange={handleChange}
                    required
                />
                <input
                    name="complemento"
                    type="text"
                    placeholder="Complemento:"
                    value={form.complemento ?? ""}
                    onChange={handleChange}
                />
                <input
                    name="bairro"
                    type="text"
                    placeholder="Bairro:"
                    value={form.bairro ?? ""}
                    onChange={handleChange}
                    required
                />
                <input
                    name="cidade"
                    type="text"
                    placeholder="Cidade:"
                    value={form.cidade ?? ""}
                    onChange={handleChange}
                    required
                />
                <input
                    name="estado"
                    type="text"
                    placeholder="Estado:"
                    value={form.estado ?? ""}
                    onChange={handleChange}
                    required
                />
                <input
                    name="cep"
                    type="text"
                    placeholder="CEP:"
                    value={form.cep ?? ""}
                    onChange={handleChange}
                    required
                />

                <button type="submit">Cadastrar-se</button>
            </form>

            <h3>
                Já possui cadastro? <a href="/">Entrar</a>
            </h3>
        </div>
    );
}
