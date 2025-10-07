'use client'

import { useState, useEffect } from "react";
import { useUser } from "@supabase/auth-helpers-react";
import "../../styles/default.css";
import { useContext } from "react";
import NavBar from "@/components/ui/nav";
import { useRouter } from "next/navigation";

export default function DefaultClients() {
  const router = useRouter()
  return ( 
    <NavBar/>
  )
}
