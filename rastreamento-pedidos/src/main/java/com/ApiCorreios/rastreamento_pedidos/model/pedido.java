package com.ApiCorreios.rastreamento_pedidos.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
    @Data
    @NoArgsConstructor
    @AllArgsConstructor

public class pedido {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String numeroDoPedido;
    private String status; // Ex: "A caminho", "Entregue"

    // Relacionamento OneToOne com a classe Endereco
    @OneToOne(cascade = CascadeType.ALL) // 'CascadeType.ALL' propaga as operações (salvar, deletar) para Endereco
    private Endereco endereco;
}
