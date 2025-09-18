package com.ApiCorreios.rastreamento_pedidos.model;


import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity // Sinaliza que esta classe é uma entidade JPA e representa uma tabela no banco
@Data // Lombok: Gera getters, setters, toString, equals e hashCode
@NoArgsConstructor // Lombok: Gera um construtor sem argumentos
@AllArgsConstructor // Lombok: Gera um construtor com todos os argumentos
public class Endereco {

    @Id // Marca o campo como a chave primária da tabela
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Configura a geração automática do ID
    private Long id;
    private String cep;
    private String logradouro; // O nome da rua
    private String complemento;
    private String bairro;
    private String localidade; // A cidade
    private String uf; // O estado
    private String numero; // Número da residência
    private String ibge;
    private String gia;
    private String ddd;
    private String siafi;
    private String erro;

}