"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import LoginForm from "./login-form"
import RegisterForm from "./register-form"

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("login")

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            {activeTab === "login" ? "Entrar na sua conta" : "Criar uma nova conta"}
          </CardTitle>
          <CardDescription className="text-center">
            {activeTab === "login"
              ? "Digite suas credenciais para acessar sua conta"
              : "Preencha os dados abaixo para se registrar"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Registro</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <LoginForm />
            </TabsContent>
            <TabsContent value="register">
              <RegisterForm />
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-center text-muted-foreground">
            {activeTab === "login" ? (
              <div>
                Não tem uma conta?{" "}
                <button
                  onClick={() => setActiveTab("register")}
                  className="underline text-primary hover:text-primary/90"
                >
                  Registre-se
                </button>
              </div>
            ) : (
              <div>
                Já tem uma conta?{" "}
                <button onClick={() => setActiveTab("login")} className="underline text-primary hover:text-primary/90">
                  Faça login
                </button>
              </div>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
