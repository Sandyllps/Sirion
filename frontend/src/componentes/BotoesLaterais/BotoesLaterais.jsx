import "./botoesLaterais.css";

function BotoesLaterais({
    tela,
    aoAbrirCadastro,
    aoAbrirLogin
}) {
    return (
        <div className={`botoes-laterais ${tela}`}>
            <button
                type="button"
                className={
                    tela === "cadastro"
                        ? "botao-cadastrar ativo"
                        : "botao-cadastrar"
                }
                onClick={aoAbrirCadastro}
            >
                Cadastrar
            </button>

            <button
                type="button"
                className={
                    tela === "login"
                        ? "botao-login ativo"
                        : "botao-login"
                }
                onClick={aoAbrirLogin}
            >
                Login
            </button>
        </div>
    );
}

export default BotoesLaterais;