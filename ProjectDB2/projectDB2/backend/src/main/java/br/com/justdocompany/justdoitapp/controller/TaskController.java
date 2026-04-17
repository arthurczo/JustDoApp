package br.com.justdocompany.justdoitapp.controller;

import br.com.justdocompany.justdoitapp.model.Task;
import br.com.justdocompany.justdoitapp.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tarefas")
@RequiredArgsConstructor
public class TaskController {
    private final TaskService service;

    @GetMapping
    public ResponseEntity<List<Task>> listar() {
        try {
            return ResponseEntity.ok(service.listarTodas());
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping
    public ResponseEntity<Task> adicionar(@RequestBody Task task) {
        try {
            return ResponseEntity.ok(service.adicionar(task));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Task> editar(@PathVariable String id, @RequestBody Task task) {
        return service.editar(id, task)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable String id) {
        try {
            service.excluir(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/{id}/concluir")
    public ResponseEntity<Task> concluir(@PathVariable String id) {
        return service.concluir(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}