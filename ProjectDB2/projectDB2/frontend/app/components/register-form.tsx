"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { EyeIcon, EyeOffIcon } from "lucide-react"

export default function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordMatch, setPasswordMatch] = useState(true)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string

    if (password !== confirmPassword) {
      setPasswordMatch(false)
      return
    }

    setPasswordMatch(true)
    setIsLoading(true)

    try {
      const res = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.get("name"),
          username: formData.get("username"),
          password,
        }),
      })
    
      if (!res.ok) throw new Error("Erro no registro")
    
      alert("Registro realizado com sucesso! Faça login.")
      // Você pode trocar a aba para login, se quiser:
      // setActiveTab("login")
    } catch (err) {
      alert("Erro ao registrar")
    } finally {
      setIsLoading(false)
    }
    
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome completo</Label>
        <Input id="name" name="name" placeholder="João Silva" required autoComplete="name" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="register-username">Nome de usuário</Label>
        <Input
          id="register-username"
          name="username"
          type="username"
          placeholder="Seu nome de usuário"
          required
          autoComplete="username"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="register-password">Senha</Label>
        <div className="relative">
          <Input
            id="register-password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            required
            autoComplete="new-password"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-3 py-2"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
            <span className="sr-only">{showPassword ? "Esconder senha" : "Mostrar senha"}</span>
          </Button>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirm-password">Confirmar senha</Label>
        <div className="relative">
          <Input
            id="confirm-password"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="••••••••"
            required
            autoComplete="new-password"
            className={!passwordMatch ? "border-red-500" : ""}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-3 py-2"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
            <span className="sr-only">{showConfirmPassword ? "Esconder senha" : "Mostrar senha"}</span>
          </Button>
        </div>
        {!passwordMatch && <p className="text-sm text-red-500">As senhas não coincidem</p>}
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Registrando..." : "Registrar"}
      </Button>
    </form>
  )
}
