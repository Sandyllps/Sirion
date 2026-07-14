import { useState } from "react";
import { cadastrarUsuario } from "../../api";

import "./cadastro.css";

function Cadastro({ aoCadastroConcluido }) {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] =
        useState("");

    const [mensagemErro, setMensagemErro] =
        useState("");

    const [mensagemSucesso, setMensagemSucesso] =
        useState("");

    const [carregando, setCarregando] =
        useState(false);

    function limparMensagens() {
        if (mensagemErro) {
            setMensagemErro("");
        }

        if (mensagemSucesso) {
            setMensagemSucesso("");
        }
    }

    async function cadastrar(evento) {
        evento.preventDefault();

        if (carregando) {
            return;
        }

        setMensagemErro("");
        setMensagemSucesso("");

        if (
            !nome.trim() ||
            !email.trim() ||
            !senha ||
            !confirmarSenha
        ) {
            setMensagemErro(
                "Preencha todos os campos para continuar."
            );
            return;
        }

        const emailValido =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

        if (!emailValido) {
            setMensagemErro(
                "Informe um endereço de e-mail válido."
            );
            return;
        }

        if (senha.length < 6) {
            setMensagemErro(
                "A senha deve possuir pelo menos 6 caracteres."
            );
            return;
        }

        if (senha !== confirmarSenha) {
            setMensagemErro(
                "A senha e a confirmação não coincidem."
            );
            return;
        }

        try {
            setCarregando(true);

            const respostaApi =
                await cadastrarUsuario(
                    nome.trim(),
                    email.trim(),
                    senha
                );

            setMensagemSucesso(
                respostaApi?.resposta ||
                "Cadastro realizado com sucesso."
            );

            setNome("");
            setEmail("");
            setSenha("");
            setConfirmarSenha("");

            window.setTimeout(() => {
                if (aoCadastroConcluido) {
                    aoCadastroConcluido();
                }
            }, 1300);
        } catch (erro) {
            console.error(
                "Erro ao cadastrar usuário:",
                erro
            );

            const servidorIndisponivel =
                erro instanceof TypeError;

            setMensagemErro(
                servidorIndisponivel
                    ? "Não foi possível conectar ao servidor. Tente novamente quando a API estiver disponível."
                    : erro.message ||
                      "Não foi possível realizar o cadastro."
            );
        } finally {
            setCarregando(false);
        }
    }

    return (
        <div className="formulario-cadastro">
            <header className="cabecalho-formulario-cadastro">
                <h1>Seja bem-vindo!</h1>

                <p className="subtitulo-cadastro">
                    Venha fazer parte da Sirion
                </p>
            </header>

            <form onSubmit={cadastrar} noValidate>
                <div className="mb-3">
                    <label
                        className="form-label"
                        htmlFor="nome-cadastro"
                    >
                        Nome
                    </label>

                    <input
                        id="nome-cadastro"
                        className="form-control campo-cadastro"
                        type="text"
                        value={nome}
                        onChange={(evento) => {
                            setNome(evento.target.value);
                            limparMensagens();
                        }}
                        autoComplete="name"
                    />
                </div>

                <div className="mb-3">
                    <label
                        className="form-label"
                        htmlFor="email-cadastro"
                    >
                        E-mail
                    </label>

                    <input
                        id="email-cadastro"
                        className="form-control campo-cadastro"
                        type="email"
                        value={email}
                        onChange={(evento) => {
                            setEmail(evento.target.value);
                            limparMensagens();
                        }}
                        autoComplete="email"
                    />
                </div>

                <div className="row g-3">
                    <div className="col-12 col-md-6">
                        <label
                            className="form-label"
                            htmlFor="senha-cadastro"
                        >
                            Senha
                        </label>

                        <input
                            id="senha-cadastro"
                            className="form-control campo-cadastro"
                            type="password"
                            value={senha}
                            onChange={(evento) => {
                                setSenha(evento.target.value);
                                limparMensagens();
                            }}
                            autoComplete="new-password"
                        />
                    </div>

                    <div className="col-12 col-md-6">
                        <label
                            className="form-label"
                            htmlFor="confirmar-senha"
                        >
                            Confirmar senha
                        </label>

                        <input
                            id="confirmar-senha"
                            className="form-control campo-cadastro"
                            type="password"
                            value={confirmarSenha}
                            onChange={(evento) => {
                                setConfirmarSenha(
                                    evento.target.value
                                );
                                limparMensagens();
                            }}
                            autoComplete="new-password"
                        />
                    </div>
                </div>

                <div
                    className="area-mensagem-cadastro"
                    aria-live="polite"
                >
                    {mensagemErro && (
                        <div
                            className="alert alert-danger mensagem-formulario"
                            role="alert"
                        >
                            {mensagemErro}
                        </div>
                    )}

                    {mensagemSucesso && (
                        <div
                            className="alert alert-success mensagem-formulario"
                            role="status"
                        >
                            {mensagemSucesso}
                        </div>
                    )}
                </div>

                <button
                    type="submit"
                    className="btn botao-enviar"
                    disabled={carregando}
                >
                    {carregando && (
                        <span
                            className="spinner-border spinner-border-sm"
                            aria-hidden="true"
                        />
                    )}

                    <span>
                        {carregando
                            ? "Cadastrando..."
                            : "Cadastrar"}
                    </span>
                </button>
            </form>
        </div>
    );
}

export default Cadastro;