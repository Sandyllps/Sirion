import "./telaCadastro.css";

import Carrossel from "../../componentes/carrossel/Carrossel";
import BotoesLaterais from "../../componentes/BotoesLaterais/BotoesLaterais";
import Cadastro from "../../componentes/Cadastro/Cadastro";

function TelaCadastro({
    aoAbrirLogin,
    aoAbrirCadastro
}) {
    return (
        <div className="pagina-cadastro">
            <div className="container-cadastro">
                <div className="imagem-lateral">
                    <Carrossel />
                </div>

                <div className="painel-cadastro">
                    <BotoesLaterais
                        tela="cadastro"
                        aoAbrirLogin={aoAbrirLogin}
                        aoAbrirCadastro={aoAbrirCadastro}
                    />

                    <Cadastro
                        aoCadastroConcluido={aoAbrirLogin}
                    />
                </div>
            </div>
        </div>
    );
}

export default TelaCadastro;