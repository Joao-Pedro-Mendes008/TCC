'use client'

import { signUp } from "../../hooks/useAuth";
import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "../../styles/login.css"

export default function EmailVerification() {
    return (
        <div>
            <div className="container">
                <h1>Verifque seu email.</h1>
                <h3>Foi enviado um email de verificação na sua caixa de entrada.</h3>
            </div>
        </div>
    )
}