'use client'

import { useState, useEffect } from "react";
import "../../styles/default.css";
import { useContext } from "react";
import NavBar from "@/components/ui/nav";
import { useRouter } from "next/navigation";
import { SessionContext } from "@/context/sessionContext";
import "@/styles/paciente.css"

export default function DefaultClients() {
  const router = useRouter()
  const { session } = useContext(SessionContext)

  return (
    <div>
    <NavBar/>
      <div className="container_pagina">
      <h3>Consultas próximas: </h3>
      <div className="consultas_proximas">
        
      </div>

      <h3>Consultar agenda completa</h3>
      </div>
    </div>
  )
}
