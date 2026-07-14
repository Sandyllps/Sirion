import "./botoesLaterais.css";

function BotoesLaterais({
    tela,
    aoAbrirCadastro,
    aoAbrirLogin
}) {
    return (
        <div
            className={`botoes-laterais ${tela}`}
            role="tablist"
            aria-label="Alternar entre login e cadastro"
        >
            <button
                type="button"
                role="tab"
                aria-selected={tela === "cadastro"}
                className={`botao-autenticacao ${
                    tela === "cadastro" ? "ativo" : ""
                }`}
                onClick={aoAbrirCadastro}
            >
                Cadastrar
            </button>

            <button
                type="button"
                role="tab"
                aria-selected={tela === "login"}
                className={`botao-autenticacao ${
                    tela === "login" ? "ativo" : ""
                }`}
                onClick={aoAbrirLogin}
            >
                Login
            </button>
        </div>
    );
}

export default BotoesLaterais;