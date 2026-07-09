import "./telaCadastro.css";

import Carrossel from "../../componentes/Carrossel/Carrossel";
import BotoesLaterais from "../../componentes/BotoesLaterais/BotoesLaterais";
import Cadastro from "../../componentes/Cadastro/Cadastro";

function TelaCadastro() {

    return (

        <div className="pagina-cadastro">

            <div className="container-cadastro">

                <div className="imagem-lateral">

                    <Carrossel />

                </div>

                <div className="painel-cadastro">

                    <BotoesLaterais tela="cadastro" />

                    <Cadastro />

                </div>

            </div>

        </div>

    );

}

export default TelaCadastro;