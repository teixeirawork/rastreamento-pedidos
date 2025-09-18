package com.ApiCorreios.rastreamento_pedidos.Controller;

import com.ApiCorreios.rastreamento_pedidos.model.Endereco;
import com.ApiCorreios.rastreamento_pedidos.service.CepService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;



@RestController // Indica que a classe é um controlador REST
@RequestMapping("/api/cep") // Define o caminho base para todos os endpoints
public class CepController {

    @Autowired // Injeta a dependência do CepService
    private CepService cepService;

    @GetMapping("/{cep}") // Mapeia requisições GET para /api/cep/{cep}
    public ResponseEntity<Endereco> buscarCep(@PathVariable String cep) {

        // Remove caracteres não-numéricos do CEP
        String cepLimpo = cep.replaceAll("[^0-9]", "");

        // Se o CEP tiver um formato inválido, retorne um erro
        if (cepLimpo.length() != 8) {
            return ResponseEntity.badRequest().build(); // Retorna um erro 400
        }

        Endereco endereco = cepService.buscarEnderecoPorCep(cepLimpo);

        if (endereco != null) {
            return ResponseEntity.ok(endereco); // Retorna o objeto Endereco com status 200 OK
        }

        return ResponseEntity.notFound().build(); // Retorna status 404 se o CEP não for encontrado
    }

     @GetMapping("/{uf}/{localidade}/{logradouro}")
    public ResponseEntity<List<Endereco>> buscarCeps(@PathVariable String uf, 
                                                     @PathVariable String localidade, 
                                                     @PathVariable String logradouro) {

        // Substitua espaços por '+' para a URL da ViaCEP
        String localidadeTratada = localidade.replace(" ", "+");
        String logradouroTratado = logradouro.replace(" ", "+");

        List<Endereco> cepsEncontrados = cepService.buscarCepsPorEndereco(uf, localidadeTratada, logradouroTratado);

        if (cepsEncontrados != null && !cepsEncontrados.isEmpty()) {
            return ResponseEntity.ok(cepsEncontrados);
        }

        return ResponseEntity.notFound().build();
    }


}