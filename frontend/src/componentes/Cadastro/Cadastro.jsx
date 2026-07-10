import { useState } from "react";
import { cadastrarUsuario } from "../../api";

import "./cadastro.css";

function Cadastro({ aoCadastroConcluido }) {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [mensagemErro, setMensagemErro] = useState("");
    const [mensagemSucesso, setMensagemSucesso] = useState("");
    const [carregando, setCarregando] = useState(false);

    async function cadastrar(evento) {
        evento.preventDefault();

        setMensagemErro("");
        setMensagemSucesso("");

        if (
            !nome.trim() ||
            !email.trim() ||
            !senha.trim() ||
            !confirmarSenha.trim()
        ) {
            setMensagemErro("Preencha todos os campos.");
            return;
        }

        if (senha !== confirmarSenha) {
            setMensagemErro("As senhas não coincidem.");
            return;
        }

        try {
            setCarregando(true);

            const respostaApi = await cadastrarUsuario(
                nome,
                email,
                senha
            );

            setMensagemSucesso(
                respostaApi?.resposta || "Cadastro realizado com sucesso."
            );

            setNome("");
            setEmail("");
            setSenha("");
            setConfirmarSenha("");

            setTimeout(() => {
                if (aoCadastroConcluido) {
                    aoCadastroConcluido();
                }
            }, 1500);

        } catch (erro) {
            console.error("Erro ao cadastrar usuário:", erro);
            setMensagemErro(erro.message);
        } finally {
            setCarregando(false);
        }
    }

    return (
        <div className="formulario-cadastro">
            <h1>Seja bem-vindo!</h1>

            <p>Venha fazer parte da Sirion!</p>

            <form onSubmit={cadastrar}>
                <label htmlFor="nome">Nome</label>

                <input
                    id="nome"
                    type="text"
                    value={nome}
                    onChange={(evento) => setNome(evento.target.value)}
                    autoComplete="name"
                />

                <label htmlFor="email-cadastro">Email</label>

                <input
                    id="email-cadastro"
                    type="email"
                    value={email}
                    onChange={(evento) => setEmail(evento.target.value)}
                    autoComplete="email"
                />

                <div className="linha-senhas">
                    <div>
                        <label htmlFor="senha-cadastro">
                            Senha
                        </label>

                        <input
                            id="senha-cadastro"
                            type="password"
                            value={senha}
                            onChange={(evento) =>
                                setSenha(evento.target.value)
                            }
                            autoComplete="new-password"
                        />
                    </div>

                    <div>
                        <label htmlFor="confirmar-senha">
                            Confirmar Senha
                        </label>

                        <input
                            id="confirmar-senha"
                            type="password"
                            value={confirmarSenha}
                            onChange={(evento) =>
                                setConfirmarSenha(evento.target.value)
                            }
                            autoComplete="new-password"
                        />
                    </div>
                </div>

                {mensagemErro && (
                    <p className="mensagem-erro">
                        {mensagemErro}
                    </p>
                )}

                {mensagemSucesso && (
                    <p className="mensagem-sucesso">
                        {mensagemSucesso}
                    </p>
                )}

                <button
                    type="submit"
                    className="botao-enviar"
                    disabled={carregando}
                >
                    {carregando ? "Cadastrando..." : "Cadastrar"}
                </button>
            </form>
        </div>
    );
}

export default Cadastro;