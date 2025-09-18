package com.ApiCorreios.rastreamento_pedidos.service;

import com.ApiCorreios.rastreamento_pedidos.model.Endereco;

import java.util.List;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service // Marca a classe como um serviço do Spring

public class CepService {

    private static final String API_VIACEP_URL = "https://viacep.com.br/ws/{cep}/json/";
    private static final String API_VIACEP_ENDERECO_URL = "https://viacep.com.br/ws/{uf}/{localidade}/{logradouro}/json/";


    public Endereco buscarEnderecoPorCep(String cep) {
        RestTemplate restTemplate = new RestTemplate();

        try {
            // Chama a API da ViaCEP e mapeia a resposta para a classe Endereco
            Endereco endereco = restTemplate.getForObject(API_VIACEP_URL, Endereco.class, cep);

            // A ViaCEP retorna um JSON com a chave "erro": true se o CEP for inválido
            if (endereco != null && "true".equals(endereco.getErro())) {
                return null; // Retorna null se houver erro (CEP não encontrado)
            }

            return endereco;
        } catch (Exception e) {
            // Trata possíveis erros de requisição, como problemas de conexão
            System.err.println("Erro ao buscar CEP: " + e.getMessage());
            return null;
        }
    }


     public List<Endereco> buscarCepsPorEndereco(String uf, String localidade, String logradouro) {
        RestTemplate restTemplate = new RestTemplate();

        try {
            // A ViaCEP retorna um array de objetos, então usamos ParameterizedTypeReference
            // para garantir que a resposta seja mapeada para uma lista de Endereco.
            ResponseEntity<List<Endereco>> response = restTemplate.exchange(
                API_VIACEP_ENDERECO_URL,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<List<Endereco>>() {},
                uf, localidade, logradouro
            );

            return response.getBody();
        } catch (Exception e) {
            System.err.println("Erro ao buscar CEPs por endereço: " + e.getMessage());
            return null;
        }
    }

}
