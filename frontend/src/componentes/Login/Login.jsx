import { useState } from "react";
import { loginUsuario } from "../../api";

import "./login.css";
import RecuperarSenha from "../RecuperarSenha/RecuperarSenha";

function Login({ aoConcluirLogin }) {
    const [mostrarRecuperacao, setMostrarRecuperacao] =
        useState(false);

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [mensagemErro, setMensagemErro] = useState("");
    const [carregando, setCarregando] = useState(false);

    function abrirRecuperacao() {
        setMostrarRecuperacao(true);
    }

    function fecharRecuperacao() {
        setMostrarRecuperacao(false);
    }

    function alterarEmail(evento) {
        setEmail(evento.target.value);

        if (mensagemErro) {
            setMensagemErro("");
        }
    }

    function alterarSenha(evento) {
        setSenha(evento.target.value);

        if (mensagemErro) {
            setMensagemErro("");
        }
    }

    async function entrar(evento) {
        evento.preventDefault();

        if (carregando) {
            return;
        }

        setMensagemErro("");

        if (!email.trim() || !senha.trim()) {
            setMensagemErro(
                "Preencha o e-mail e a senha para continuar."
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

        try {
            setCarregando(true);

            const dadosUsuario = await loginUsuario(
                email.trim(),
                senha
            );

            if (aoConcluirLogin) {
                aoConcluirLogin(dadosUsuario);
            }
        } catch (erro) {
            console.error("Erro ao fazer login:", erro);

            const servidorIndisponivel =
                erro instanceof TypeError;

            setMensagemErro(
                servidorIndisponivel
                    ? "Não foi possível conectar ao servidor. Tente novamente quando a API estiver disponível."
                    : erro.message ||
                      "Não foi possível realizar o login."
            );
        } finally {
            setCarregando(false);
        }
    }

    return (
        <>
            <div className="formulario-login">
                <header className="cabecalho-formulario-login">
                    <h1>Que bom ter você de volta!</h1>

                    <p className="subtitulo-login">
                        Faça seu login para continuar
                    </p>
                </header>

                <form onSubmit={entrar} noValidate>
                    <div className="mb-3">
                        <label
                            className="form-label"
                            htmlFor="email"
                        >
                            E-mail
                        </label>

                        <input
                            id="email"
                            className="form-control campo-login"
                            type="email"
                            value={email}
                            onChange={alterarEmail}
                            autoComplete="email"
                            aria-invalid={
                                mensagemErro ? "true" : "false"
                            }
                        />
                    </div>

                    <div className="mb-2">
                        <label
                            className="form-label"
                            htmlFor="senha"
                        >
                            Senha
                        </label>

                        <input
                            id="senha"
                            className="form-control campo-login"
                            type="password"
                            value={senha}
                            onChange={alterarSenha}
                            autoComplete="current-password"
                            aria-invalid={
                                mensagemErro ? "true" : "false"
                            }
                        />
                    </div>

                    <div className="area-recuperar-senha">
                        <button
                            type="button"
                            className="btn btn-link esqueci-senha"
                            onClick={abrirRecuperacao}
                        >
                            Esqueci minha senha
                        </button>
                    </div>

                    <div
                        className="area-mensagem-login"
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
                                ? "Entrando..."
                                : "Entrar"}
                        </span>
                    </button>
                </form>
            </div>

            {mostrarRecuperacao && (
                <RecuperarSenha
                    fecharPopup={fecharRecuperacao}
                />
            )}
        </>
    );
}

export default Login;