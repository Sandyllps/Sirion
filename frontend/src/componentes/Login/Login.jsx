import { useState } from "react";
import { loginUsuario } from "../../api";

import "./login.css";
import RecuperarSenha from "../RecuperarSenha/RecuperarSenha";

function Login({ aoConcluirLogin }) {
    const [mostrarRecuperacao, setMostrarRecuperacao] = useState(false);
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

    async function entrar(evento) {
        evento.preventDefault();

        setMensagemErro("");

        if (!email.trim() || !senha.trim()) {
            setMensagemErro("Preencha o e-mail e a senha.");
            return;
        }

        try {
            setCarregando(true);

            const dadosUsuario = await loginUsuario(email, senha);

            if (aoConcluirLogin) {
                aoConcluirLogin(dadosUsuario);
            }
        } catch (erro) {
            console.error("Erro ao fazer login:", erro);
            setMensagemErro(erro.message);
        } finally {
            setCarregando(false);
        }
    }

    return (
        <>
            <div className="formulario-login">
                <h1>Que bom ter você de volta!</h1>

                <p>Faça seu login para continuar</p>

                <form onSubmit={entrar}>
                    <label htmlFor="email">E-mail</label>

                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(evento) => setEmail(evento.target.value)}
                        autoComplete="email"
                    />

                    <label htmlFor="senha">Senha</label>

                    <input
                        id="senha"
                        type="password"
                        value={senha}
                        onChange={(evento) => setSenha(evento.target.value)}
                        autoComplete="current-password"
                    />

                    {mensagemErro && (
                        <p className="mensagem-erro">
                            {mensagemErro}
                        </p>
                    )}

                    <button
                        type="button"
                        className="esqueci-senha"
                        onClick={abrirRecuperacao}
                    >
                        Esqueci minha senha
                    </button>

                    <button
                        type="submit"
                        className="botao-enviar"
                        disabled={carregando}
                    >
                        {carregando ? "Entrando..." : "Entrar"}
                    </button>
                </form>
            </div>

            {mostrarRecuperacao && (
                <RecuperarSenha fecharPopup={fecharRecuperacao} />
            )}
        </>
    );
}

export default Login;