const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:8080";


// Função para tratar as respostas da API. Não havia sido criada
async function tratarResposta(resposta) {
    let dados = null;
    const texto = await resposta.text();

    if (texto) {
        try {
            dados = JSON.parse(texto);
        } catch {
            dados = texto;
        }
    }

    if (!resposta.ok) {
        throw new Error(
            dados?.mensagem ||
            dados?.resposta ||
            dados?.response ||
            dados?.erro ||
            "Ocorreu um erro na requisição."
        )
    }

    return dados;
}


export async function loginUsuario(email, senha) {
    const resposta = await fetch(
        `${API_URL}/auth/login`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                senha
            })
        }
    );

    return tratarResposta(resposta);
}

export async function cadastrarUsuario(
    nome,
    email,
    senha
) {
    const resposta = await fetch(
        `${API_URL}/auth/signup`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nome,
                email,
                senha
            })
        }
    );

    return tratarResposta(resposta);
}

export async function buscarZonasPorUsuario(idUsuario) {
    const resposta = await fetch(`${API_URL}/zone?id_usuario=${idUsuario}`);

    const dados = await tratarResposta(resposta);

    return Array.isArray(dados) ? dados : dados?.zonas || [];
}

export async function criarZona(dadosZona) {
    const resposta = await fetch(`${API_URL}/zone`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dadosZona)
    });

    return tratarResposta(resposta);
}

export async function editarZona(idZona, idUsuario, dadosZona) {
    const resposta = await fetch(`${API_URL}/zone/${idZona}?id_usuario=${idUsuario}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dadosZona)
    });

    return tratarResposta(resposta);
}

export async function excluirZona(idZona) {
    const resposta = await fetch(`${API_URL}/zone/${idZona}`, {
        method: "DELETE"
    });

    const texto = await resposta.text();

    let dados = null;

    if (texto) {
        try {
            dados = JSON.parse(texto);
        } catch {
            dados = texto;
        }
    }

    if (!resposta.ok) {
        throw new Error(
            dados?.mensagem ||
            dados?.resposta ||
            "Não foi possível excluir a zona."
        );
    }

    return dados;
}

export async function buscarDadosDashboard(chaveEsp) {
    const resposta = await fetch(
        `${API_URL}/dashboard?chave_esp=${encodeURIComponent(chaveEsp)}`
    );

    const dados = await resposta.json();

    if (!resposta.ok) {
        throw new Error(
            dados?.mensagem ||
            "Não foi possível carregar os dados do Dashboard."
        );
    }

    return dados;
}

export async function atualizarModoIrrigacao(
    idZona,
    idUsuario,
    modoIrrigacao
) {
    return editarZona(
        idZona,
        idUsuario,
        {
            modo_irrigacao: modoIrrigacao
        }
    );
}

export async function controlarBombaManual(
    idZona,
    idUsuario,
    acao
) {
    const resposta = await fetch(
        `${API_URL}/zone/${idZona}/bomba?id_usuario=${encodeURIComponent(idUsuario)}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                acao
            })
        }
    );

    return tratarResposta(resposta);
}

export async function registrarIrrigacaoManual(
    idZona,
    idUsuario
) {
    const dataAtual = new Date().toISOString();

    return editarZona(
        idZona,
        idUsuario,
        {
            ultima_irrigacao: dataAtual
        }
    );
}

export async function recuperarSenhaUsuario(
    email,
    novaSenha
) {
    const resposta = await fetch(
        `${API_URL}/auth/recuperar-senha`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                novaSenha
            })
        }
    );

    return tratarResposta(resposta);
}

