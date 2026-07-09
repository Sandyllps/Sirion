const API_URL = "http://localhost:8080";


async function tratarResposta(resposta) {
    const texto = await resposta.text();

    let dados = null;

    if (texto) {
        dados = JSON.parse(texto);
    }

    if (!resposta.ok) {
        throw new Error(dados?.mensagem || texto || "Erro na requisição.");
    }

    return dados;
}


export async function loginUsuario(email, senha) {
    const resposta = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email,
            senha
        })
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
        throw new Error(dados?.mensagem || "Erro ao fazer login.");
    }

    return dados;
}

export async function cadastrarUsuario(nome, email, senha) {
    const resposta = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            nome,
            email,
            senha
        })
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
        throw new Error(dados?.mensagem || "Erro ao cadastrar usuário.");
    }

    return dados;
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

    if (!resposta.ok) {
        const dados = await resposta.json();
        throw new Error(dados?.mensagem || "Erro ao excluir zona.");
    }

    return true;
}