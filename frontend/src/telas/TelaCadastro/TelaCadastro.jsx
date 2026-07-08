import "./telaCadastro.css";

import Cadastro from "../../componentes/Cadastro/Cadastro";
import Carrossel from "../../componentes/Carrossel/Carrossel";
import BotoesLaterais from "../../componentes/BotoesLaterais/BotoesLaterais";

function TelaCadastro() {

    return (

        <div className="pagina-cadastro">

            <div className="container-cadastro">

                <div className="imagem-lateral">

                    <Carrossel />

                </div>

                <div className="painel-cadastro">

                    <BotoesLaterais />

                    <Cadastro />

                </div>

            </div>

        </div>

    );

}

export default TelaCadastro;