package br.com.justdocompany.justdoitapp.service;

import br.com.justdocompany.justdoitapp.model.Task;
import br.com.justdocompany.justdoitapp.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TaskService {
    private final TaskRepository repository;
    private final UserService userService;

    public List<Task> listarTodas() {
        String userId = userService.getCurrentUser().getId();
        return repository.findByUserId(userId);
    }

    public Task adicionar(Task task) {
        String userId = userService.getCurrentUser().getId();
        task.setUserId(userId);
        task.setConcluida(false);
        return repository.save(task);
    }

    public Optional<Task> editar(String id, Task novaTask) {
        String userId = userService.getCurrentUser().getId();
        return repository.findByIdAndUserId(id, userId).map(t -> {
            t.setDescricao(novaTask.getDescricao());
            t.setTitulo(novaTask.getTitulo());
            return repository.save(t);
        });
    }

    public void excluir(String id) {
        String userId = userService.getCurrentUser().getId();
        Task task = repository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new RuntimeException("Tarefa não encontrada ou sem permissão"));
        repository.delete(task);
    }

    public Optional<Task> concluir(String id) {
        String userId = userService.getCurrentUser().getId();
        return repository.findByIdAndUserId(id, userId).map(t -> {
            t.setConcluida(true);
            return repository.save(t);
        });
    }
}