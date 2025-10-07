'use client'

import { signIn } from "../../hooks/useAuth";
import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "../../styles/login.css"


export default function signInPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const handleClick = async (e) => {
    e.preventDefault();
    router.push("./signUp")
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { user, error } = await signIn(email, password);
    if (error || !user) {
      console.log("Email ou senha incorretos");
      return;
    }
    console.log("Login bem-sucedido:", user);
    router.push("/default");
  };

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

          <button type="submit">Entrar</button>

        </form>
        <h3> Não possui cadastro? <a onClick={handleClick}>Cadastrar-se</a></h3>
      </div>
    </div>
  )

}