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
  const [errorMessage, setErrorMessage] = useState("");
  const handleClick = async (e) => {
    e.preventDefault();
    router.push("./signUp")
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { user, error } = await signIn(email, password);
    if (error || !user) {
      setErrorMessage("Email ou senha incorretos");
      return;
    }
    console.log("Login bem-sucedido:", user);
    router.push("/default");
  };

  return (
    <div>
      <div className="container">
        <div className="primaryText">Bem vindo!</div>
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

          {errorMessage && <p className="error">{errorMessage}</p>}
        </form>
        <h3> Não possui cadastro? <a onClick={handleClick}>Cadastrar-se</a></h3>
      </div>
    </div>
  )

}