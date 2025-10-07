'use client'

import { useState, useEffect } from "react";
import { useUser } from "@supabase/auth-helpers-react";
"../default.css"

export default function DefaultClients() {
  const user = useUser();

  if (!user) {
    return <p>Carregando...</p>; // ou redirecionar para login
  }

  return <h1>Bem-vindo, {user.email}!</h1>;
}
