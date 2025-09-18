document.addEventListener('DOMContentLoaded', () => {
    // Seleciona os elementos do HTML usando seus IDs
    const cepInput = document.getElementById('cep');
    const logradouroInput = document.getElementById('logradouro');
    const bairroInput = document.getElementById('bairro');
    const localidadeInput = document.getElementById('localidade');
    const ufInput = document.getElementById('uf');
    const resultadoDiv = document.getElementById('resultado');

    // Função para limpar os campos de endereço
    const limparCamposEndereco = () => {
        logradouroInput.value = '';
        bairroInput.value = '';
        localidadeInput.value = '';
        ufInput.value = '';
        resultadoDiv.textContent = "";
    };

    // Função assíncrona para buscar o CEP na sua API de backend
    const buscarCep = async (cep) => {
        // Remove qualquer caractere que não seja número
        const cepLimpo = cep.replace(/\D/g, '');

        // Verifica se o CEP tem exatamente 8 dígitos
        if (cepLimpo.length !== 8) {
            limparCamposEndereco();
            return;
        }

        try {
            // Chama o seu endpoint de backend que busca o CEP
            const response = await fetch(`http://localhost:8080/api/cep/${cepLimpo}`);
            
            // Verifica se a resposta foi bem-sucedida (status 200 OK)
            if (response.ok) {
                const data = await response.json();
                
                // Preenche os campos do formulário com os dados retornados
                logradouroInput.value = data.logradouro;
                bairroInput.value = data.bairro;
                localidadeInput.value = data.localidade;
                ufInput.value = data.uf;
                
            } else {
                // Se a resposta não for OK (ex: 404 Not Found)
                limparCamposEndereco();
                resultadoDiv.textContent = "CEP não encontrado.";
            }
        } catch (error) {
            // Em caso de erro na requisição (problema de rede, servidor fora do ar, etc.)
            limparCamposEndereco();
            resultadoDiv.textContent = "Erro na conexão. Tente novamente mais tarde.";
            console.error("Erro ao buscar CEP:", error);
        }
    };

    // Adiciona um evento de "keyup" para o campo CEP
    // A cada tecla digitada, verifica se o CEP está completo e chama a função de busca
    cepInput.addEventListener('keyup', (e) => {
        const cep = e.target.value;
        if (cep.length === 8) {
            buscarCep(cep);
        }
    });

    // Evento de "blur" para o campo CEP
    // Garante que a busca seja feita quando o usuário sai do campo, mesmo que não tenha digitado 8 caracteres de uma vez
    cepInput.addEventListener('blur', (e) => {
        const cep = e.target.value;
        if (cep.length > 0) { // Se o campo não estiver vazio, tenta a busca
            buscarCep(cep);
        }
    });
});