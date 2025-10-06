'use client'

import { signUp } from "../../hooks/useAuth";
import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "../../styles/login.css"


export default function signUpPage() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [name, setName] = useState("")
    const [phone, setPhone] = useState("")
    const role = "paciente"
    const handleSubmit = async (e) => {
        e.preventDefault();
        await signUp({ email, password, name, phone, role });
        router.push("/verify")
    }

    return (
        <div>
            <div className="container">
                <h1>Bem vindo!</h1>
                <form onSubmit={handleSubmit}>

                    <input
                        placeholder="Email:"
                        type="email"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value) }} />

                    <input
                        placeholder="Senha:"
                        type="password"
                        value={password}
                        onChange={(e) => { setPassword(e.target.value) }} />

                    <input
                        placeholder="Nome:"
                        type="text"
                        value={name}
                        onChange={(e) => { setName(e.target.value) }} />

                    <input
                        placeholder="Telefone:"
                        type="text"
                        value={phone}
                        onChange={(e) => { setPhone(e.target.value) }} />

                    <button type="submit">Cadastrar-se</button>

                </form>
                <h3> Não possui cadastro? <a href="">Cadastrar-se</a></h3>
            </div>
        </div>
    )

}