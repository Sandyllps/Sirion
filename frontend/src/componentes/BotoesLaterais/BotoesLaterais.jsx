import "./botoesLaterais.css";

function BotoesLaterais({ tela }) {
    return (
        <div className={`botoes-laterais ${tela}`}>
            <button
                type="button"
                className={tela === "cadastro" ? "botao-cadastrar ativo" : "botao-cadastrar"}
            >
                Cadastrar
            </button>

            <button
                type="button"
                className={tela === "login" ? "botao-login ativo" : "botao-login"}
            >
                Login
            </button>
        </div>
    );
}

export default BotoesLaterais;