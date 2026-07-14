import "./telaLogin.css";

import Carrossel from "../../componentes/carrossel/Carrossel";
import BotoesLaterais from "../../componentes/BotoesLaterais/BotoesLaterais";
import Login from "../../componentes/Login/Login";

function TelaLogin({
    aoConcluirLogin,
    aoAbrirLogin,
    aoAbrirCadastro
}) {
    return (
        <div className="pagina-login">
            <div className="container-login">
                <div className="painel-login">
                    <BotoesLaterais
                        tela="login"
                        aoAbrirLogin={aoAbrirLogin}
                        aoAbrirCadastro={aoAbrirCadastro}
                    />

                    <Login
                        aoConcluirLogin={aoConcluirLogin}
                    />
                </div>

                <div className="imagem-lateral">
                    <Carrossel />
                </div>
            </div>
        </div>
    );
}

export default TelaLogin;