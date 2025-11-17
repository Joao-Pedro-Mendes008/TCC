"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { consulSignUp } from "../../../hooks/useAuth"; // função que você mostrou antes
import "@/styles/login.css";

export default function ConsulSignUpPage() {
    const router = useRouter();

    const [form, setForm] = useState({
        email: "",
        password: "",
        nome: "",
        telefone: "",
        cep: "",
        endereco: "",
        numero: "",
        complemento: "",
        bairro: "",
        cidade: "",
        estado: "",
        especialidade: "",
        cnpj: "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const validarTelefone = (tel) => {
        return /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/.test(tel);
    };

    const validarCEP = (cep) => {
        return /^\d{5}-?\d{3}$/.test(cep);
    };

    const validarCNPJ = (cnpj) => {
        cnpj = cnpj.replace(/[^\d]/g, "");
        if (cnpj.length !== 14) return false;
        if (/^(\d)\1+$/.test(cnpj)) return false;
        let tamanho = cnpj.length - 2;
        let numeros = cnpj.substring(0, tamanho);
        let digitos = cnpj.substring(tamanho);
        let soma = 0;
        let pos = tamanho - 7;
        for (let i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2) pos = 9;
        }
        let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
        if (resultado != digitos.charAt(0)) return false;
        tamanho = tamanho + 1;
        numeros = cnpj.substring(0, tamanho);
        soma = 0;
        pos = tamanho - 7;
        for (let i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2) pos = 9;
        }
        resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
        return resultado == digitos.charAt(1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validarTelefone(form.telefone)) {
            alert("Telefone inválido. Use o formato (XX) XXXXX-XXXX.");
            return;
        }

        if (!validarCEP(form.cep)) {
            alert("CEP inválido. Use o formato XXXXX-XXX.");
            return;
        }

        if (!validarCNPJ(form.cnpj)) {
            alert("CNPJ inválido.");
            return;
        }

        const result = await consulSignUp({
            ...form,
        });

        if (!result.error) {
            router.push("/verify");
        } else {
            alert("Erro ao cadastrar consultório. Verifique os dados e tente novamente.");
            console.error(result.error);
        }
    };

    return (
        <div className="container">
            <div className="primaryText">Cadastro de Consultório</div>

            <form onSubmit={handleSubmit} className="formContainer">
                <input
                    name="email"
                    type="email"
                    placeholder="Email:"
                    value={form.email}
                    onChange={handleChange}
                    required
                />
                <input
                    name="password"
                    type="password"
                    placeholder="Senha:"
                    value={form.password}
                    onChange={handleChange}
                    required
                />
                <input
                    name="nome"
                    type="text"
                    placeholder="Nome do consultório:"
                    value={form.nome}
                    onChange={handleChange}
                    required
                />
                <input
                    name="telefone"
                    type="text"
                    placeholder="Telefone (XX) XXXXX-XXXX:"
                    value={form.telefone}
                    onChange={handleChange}
                    required
                />
                <input
                    name="especialidade"
                    type="text"
                    placeholder="Especialidade:"
                    value={form.especialidade}
                    onChange={handleChange}
                    required
                />
                <input
                    name="cnpj"
                    type="text"
                    placeholder="CNPJ:"
                    value={form.cnpj}
                    onChange={handleChange}
                    required
                />
                <input
                    name="cep"
                    type="text"
                    placeholder="CEP:"
                    value={form.cep}
                    onChange={handleChange}
                    required
                />
                <input
                    name="endereco"
                    type="text"
                    placeholder="Endereço:"
                    value={form.endereco}
                    onChange={handleChange}
                    required
                />
                <input
                    name="numero"
                    type="text"
                    placeholder="Número:"
                    value={form.numero}
                    onChange={handleChange}
                    required
                />
                <input
                    name="bairro"
                    type="text"
                    placeholder="Bairro:"
                    value={form.bairro}
                    onChange={handleChange}
                />
                <input
                    name="complemento"
                    type="text"
                    placeholder="Complemento:"
                    value={form.complemento}
                    onChange={handleChange}
                />
                <input
                    name="cidade"
                    type="text"
                    placeholder="Cidade:"
                    value={form.cidade}
                    onChange={handleChange}
                    required
                />
                <input
                    name="estado"
                    type="text"
                    placeholder="Estado:"
                    value={form.estado}
                    onChange={handleChange}
                    required
                />

                <button type="submit">Cadastrar consultório</button>
            </form>

            <h3>
                Já possui cadastro? <a href="/">Entrar</a>
            </h3>
        </div>
    );
}
