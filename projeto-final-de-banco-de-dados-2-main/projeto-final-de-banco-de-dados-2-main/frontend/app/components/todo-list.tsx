"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Trash, Pencil, LogOut } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface Task {
  id: number
  titulo: string
  descricao: string
  concluida: boolean
}

export default function TodoList() {
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState("")
  const [newTaskDescription, setNewTaskDescription] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Estados para o diálogo de edição
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [editedText, setEditedText] = useState("")
  const [editedDescription, setEditedDescription] = useState("")

  // Verificar autenticação
  // Modificação do useEffect de verificação de autenticação
useEffect(() => {
  const checkAuth = async () => {
    setIsLoading(true)
    const token = localStorage.getItem("token")
    
    if (!token) {
      console.log("Token não encontrado, redirecionando para login")
      setIsAuthenticated(false)
      router.push("/registro")
      return
    }

    try {
      // Verificação simplificada do token
      // Opção 1: Tentar buscar tarefas como prova de autenticação
      const response = await fetch("http://localhost:8080/api/tarefas", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        console.log("Usuário autenticado - token válido")
        setIsAuthenticated(true)
        const data = await response.json()
        setTasks(data)
      } else {
        console.log("Token inválido, redirecionando para login")
        localStorage.removeItem("token")
        setIsAuthenticated(false)
        router.push("/registro")
      }
    } catch (error) {
      console.error("Erro ao verificar autenticação:", error)
      setIsAuthenticated(false)
      router.push("/registro")
    } finally {
      setIsLoading(false)
    }
  }

  checkAuth()
}, [router])

  // Função para fazer logout
  const handleLogout = () => {
    localStorage.removeItem("token")
    setIsAuthenticated(false)
    router.push("/registro")
  }

  // Carregar tarefas da API
  const fetchTasks = async () => {
    const token = localStorage.getItem("token")
    try {
      const response = await fetch("http://localhost:8080/api/tarefas", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        console.log("Tarefas carregadas:", data)
        setTasks(data)
      } else {
        if (response.status === 401) {
          console.log("Token expirado ou inválido")
          localStorage.removeItem("token")
          setIsAuthenticated(false)
          router.push("/login")
          return
        }
        console.error("Erro ao carregar tarefas:", await response.text())
      }
    } catch (error) {
      console.error("Erro na requisição:", error)
    }
  }

  // Adicionar nova tarefa
  const addTask = async () => {
    if (newTask.trim() !== "") {
      const token = localStorage.getItem("token")
      try {
        const response = await fetch("http://localhost:8080/api/tarefas", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            titulo: newTask,
            descricao: newTaskDescription,
            concluida: false,
          }),
        })

        if (response.ok) {
          const newTaskData = await response.json()
          setTasks([...tasks, newTaskData])
          setNewTask("")
          setNewTaskDescription("")
        } else {
          if (response.status === 401) {
            handleLogout()
            return
          }
          console.error("Erro ao adicionar tarefa:", await response.text())
        }
      } catch (error) {
        console.error("Erro na requisição:", error)
      }
    }
  }

  // Alterar o status de conclusão da tarefa
  const toggleTaskCompletion = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation() // Evita que o clique propague para o container da tarefa
    const token = localStorage.getItem("token")
    try {
      const response = await fetch(`http://localhost:8080/api/tarefas/${id}/concluir`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const updatedTask = await response.json()
        setTasks(tasks.map((task) => (task.id === id ? updatedTask : task)))
      } else {
        if (response.status === 401) {
          handleLogout()
          return
        }
        console.error("Erro ao concluir tarefa:", await response.text())
      }
    } catch (error) {
      console.error("Erro na requisição:", error)
    }
  }

  // Remover tarefa
  const removeTask = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation() // Evita que o clique propague para o container da tarefa
    const token = localStorage.getItem("token")
    try {
      const response = await fetch(`http://localhost:8080/api/tarefas/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        setTasks(tasks.filter((task) => task.id !== id))
      } else {
        if (response.status === 401) {
          handleLogout()
          return
        }
        console.error("Erro ao remover tarefa:", await response.text())
      }
    } catch (error) {
      console.error("Erro na requisição:", error)
    }
  }

  // Abrir diálogo de edição
  const openEditDialog = (task: Task) => {
    setEditingTask(task)
    setEditedText(task.titulo)
    setEditedDescription(task.descricao)
    setIsEditDialogOpen(true)
  }

  // Salvar tarefa editada
  const saveEditedTask = async () => {
    if (editingTask && editedText.trim() !== "") {
      const token = localStorage.getItem("token")
      
      console.log("Enviando para API:", {
        titulo: editedText,
        descricao: editedDescription,
        concluida: editingTask.concluida
      });
      
      try {
        const response = await fetch(`http://localhost:8080/api/tarefas/${editingTask.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            titulo: editedText,
            descricao: editedDescription,
            concluida: editingTask.concluida,
          }),
        })
        
        if (response.ok) {
          try {
            const updatedTask = await response.json()
            console.log("Tarefa atualizada retornada pela API:", updatedTask)
            
            setTasks(prevTasks => {
              const newTasks = prevTasks.map(task => {
                if (task.id === editingTask.id) {
                  return updatedTask;
                }
                return task;
              });
              return newTasks;
            });
            
            setIsEditDialogOpen(false);
            setEditingTask(null);
          } catch (jsonError) {
            console.error("Erro ao processar JSON da resposta:", jsonError);
            await fetchTasks(); // Recarregar todas as tarefas como fallback
          }
        } else {
          if (response.status === 401) {
            handleLogout()
            return
          }
          
          let errorText = "";
          try {
            errorText = await response.text();
          } catch (e) {
            errorText = "Erro desconhecido";
          }
          console.error("Erro ao atualizar tarefa:", errorText);
          alert(`Erro ao atualizar tarefa: ${response.status} ${errorText}`);
        }
      } catch (error) {
        console.error("Erro na requisição:", error);
        alert("Erro na conexão com o servidor");
      }
    }
  }

  // Renderização condicional baseada no estado de autenticação e carregamento
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg">Carregando...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null; // Não renderizar nada, o redirecionamento já foi tratado no useEffect
  }

  return (
    <>
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-center">Lista de Tarefas</CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleLogout}
            className="flex items-center gap-1"
          >
            <LogOut className="h-4 w-4" /> Sair
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="Adicionar nova tarefa"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  addTask()
                }
              }}
            />
            <Button onClick={addTask}>Adicionar</Button>
          </div>
          <Input
            type="text"
            placeholder="Descrição (opcional)"
            value={newTaskDescription}
            onChange={(e) => setNewTaskDescription(e.target.value)}
            className="mt-2"
          />

          <div className="space-y-2">
            {tasks.length === 0 ? (
              <p className="text-center text-muted-foreground">Nenhuma tarefa adicionada</p>
            ) : (
              tasks.map((task) => (
                <div
                  key={task.id}
                  className={`flex flex-col p-3 rounded-lg border ${
                    task.concluida ? "bg-muted/50" : ""
                  } cursor-pointer hover:bg-accent/50 transition-colors`}
                  onClick={() => openEditDialog(task)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`task-${task.id}`}
                        checked={task.concluida}
                        onCheckedChange={(checked) => {
                          const e = { stopPropagation: () => {} } as React.MouseEvent
                          toggleTaskCompletion(task.id, e)
                        }}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <label
                        htmlFor={`task-${task.id}`}
                        className={`font-medium ${task.concluida ? "line-through text-muted-foreground" : ""}`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {task.titulo}
                      </label>
                    </div>
                    <div className="flex items-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => removeTask(task.id, e)}
                        aria-label="Remover tarefa"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation()
                          openEditDialog(task)
                        }}
                        aria-label="Editar tarefa"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {task.descricao && (
                    <p className={`ml-6 text-sm text-muted-foreground mt-1 ${task.concluida ? "line-through" : ""}`}>
                      {task.descricao}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
        if (!open) {
          setEditingTask(null);
        }
        setIsEditDialogOpen(open);
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Tarefa</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="task-title">Título</Label>
              <Input 
                id="task-title" 
                value={editedText} 
                onChange={(e) => setEditedText(e.target.value)} 
                autoFocus
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="task-description">Descrição</Label>
              <Textarea
                id="task-description"
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={saveEditedTask}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}