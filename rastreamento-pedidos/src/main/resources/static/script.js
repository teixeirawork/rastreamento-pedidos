document.addEventListener('DOMContentLoaded', () => {
    // Seleciona os elementos do HTML usando seus IDs
    const cepInput = document.getElementById('cep');
    const logradouroInput = document.getElementById('logradouro');
    const bairroInput = document.getElementById('bairro');
    const localidadeInput = document.getElementById('localidade');
    const ufInput = document.getElementById('uf');
    const resultadoDiv = document.getElementById('resultado');
    const buscaCepForm = document.getElementById('buscaCepForm');
    const ufBuscaInput = document.getElementById('ufBusca');
    const cidadeBuscaInput = document.getElementById('cidadeBusca');
    const logradouroBuscaInput = document.getElementById('logradouroBusca');
    const listaCepsDiv = document.getElementById('listaCeps');
    const btnLimpar = document.getElementById('btnLimpar');
    const limparFormulario1 = document.getElementById('limparFormulario1');

    
    // Função para limpar os campos de endereço
    const limparCamposEndereco = () => {
        logradouroInput.value = '';
        bairroInput.value = '';
        localidadeInput.value = '';
        ufInput.value = '';
        resultadoDiv.textContent = "";
    };

    // NOVA FUNÇÃO: Limpar o primeiro formulário
    const limparPrimeiroFormulario = () => {
        document.getElementById('numeroPedido').value = '';
        document.getElementById('cep').value = '';
        limparCamposEndereco();
    };

    // Adiciona um evento de clique ao novo botão
    limparFormulario1.addEventListener('click', () => {
        limparPrimeiroFormulario();
    });

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
     // Adiciona evento de "submit" para o formulário de busca de CEP
    buscaCepForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const uf = ufBuscaInput.value;
        const cidade = cidadeBuscaInput.value;
        const logradouro = logradouroBuscaInput.value;

        listaCepsDiv.textContent = "Buscando CEPs...";
        listaCepsDiv.style.display = 'block';

        try {
            const response = await fetch(`http://localhost:8080/api/cep/${uf}/${cidade}/${logradouro}`);

            if (response.ok) {
                const cepsEncontrados = await response.json();

                if (cepsEncontrados.length > 0) {
                    listaCepsDiv.innerHTML = '<h3>CEPs Encontrados:</h3>';
                    cepsEncontrados.forEach(item => {
                        const p = document.createElement('p');
                        p.textContent = `${item.cep} - ${item.logradouro}, ${item.bairro}`;
                        listaCepsDiv.appendChild(p);
                    });
                } else {
                    listaCepsDiv.textContent = "Nenhum CEP encontrado para este endereço.";
                }
            } else {
                listaCepsDiv.textContent = "Erro na busca. Verifique os dados e tente novamente.";
            }
        } catch (error) {
            listaCepsDiv.textContent = "Erro na conexão. Tente novamente mais tarde.";
            console.error("Erro ao buscar CEPs por endereço:", error);
        }
    });

    // Adiciona evento de "click" para o botão de limpar
    btnLimpar.addEventListener('click', () => {
        // Limpa os campos do primeiro formulário
        document.getElementById('numeroPedido').value = '';
        document.getElementById('cep').value = '';
        limparCamposEndereco();

        // Limpa os campos do segundo formulário
        ufBuscaInput.value = '';
        cidadeBuscaInput.value = '';
        logradouroBuscaInput.value = '';

        // Esconde os resultados da busca
        listaCepsDiv.style.display = 'none';
    });

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