import { useState } from "react";
import "./login.css";
import RecuperarSenha from "../RecuperarSenha/RecuperarSenha";

function Login() {

    const [mostrarRecuperacao, setMostrarRecuperacao] = useState(false);

    function abrirRecuperacao() {
        setMostrarRecuperacao(true);
    }

    function fecharRecuperacao() {
        setMostrarRecuperacao(false);
    }

    return (
        <>
            <div className="formulario-login">

                <h1>Que bom ter você de volta!</h1>

                <p>Faça seu login para continuar</p>

                <form>

                    <label>E-mail</label>
                    <input type="email"/>

                    <label>Senha</label>
                    <input type="password"/>

                    <button
                        type="button"
                        className="esqueci-senha"
                        onClick={abrirRecuperacao}
                    >
                        Esqueci minha senha
                    </button>

                    <button className="botao-enviar">
                        Entrar
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