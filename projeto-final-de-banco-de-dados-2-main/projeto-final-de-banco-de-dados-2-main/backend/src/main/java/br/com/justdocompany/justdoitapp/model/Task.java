package br.com.justdocompany.justdoitapp.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "tasks")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Task {
      @Id
    private String id;

    @NotBlank(message = "Descrição é obrigatória")
    @Size(max = 255, message = "Descrição muito longa")
    private String descricao;
    private String titulo;

    private boolean concluida;

    private String userId;
}
