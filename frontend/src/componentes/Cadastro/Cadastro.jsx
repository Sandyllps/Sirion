import "./telaCadastro.css";

import Carrossel from "../../componentes/Carrossel/Carrossel";
import Cadastro from "../../componentes/Cadastro/Cadastro";

function TelaCadastro() {

    return (

        <div className="pagina-cadastro">

            <div className="container-cadastro">

                <div className="imagem-lateral">

                    <Carrossel />

                </div>

                <div className="painel-cadastro">

                    <div className="botoes-laterais">

                        <button className="botao-cadastrar">

                            Cadastrar

                        </button>

                        <button className="botao-login">

                            Login

                        </button>

                    </div>

                    <Cadastro />

                </div>

            </div>

        </div>

    );

}

export default TelaCadastro;