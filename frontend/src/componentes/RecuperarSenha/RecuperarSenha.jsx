import "./recuperarSenha.css";

function RecuperarSenha({ fecharPopup }) {

    function enviarRecuperacao(evento) {
        evento.preventDefault();

        /*
            Aqui depois entra a integração com a API.
            Para o projeto acadêmico, podemos fazer de forma simples:
            - enviar o e-mail para o backend
            - backend verifica se existe
            - backend permite redefinir a senha ou gera um código simples
        */

        alert("Instruções de recuperação enviadas para o e-mail informado.");
        fecharPopup();
    }

    return (
        <div className="fundo-popup-recuperacao">

            <div className="popup-recuperacao">

                <button
                    type="button"
                    className="fechar-popup"
                    onClick={fecharPopup}
                >
                    ×
                </button>

                <h2>Recuperar senha</h2>

                <p>
                    Informe o e-mail cadastrado para receber as instruções de recuperação.
                </p>

                <form onSubmit={enviarRecuperacao}>

                    <label>E-mail cadastrado</label>

                    <input
                        type="email"
                        name="emailRecuperacao"
                        required
                    />

                    <button type="submit" className="botao-recuperar">
                        Enviar instruções
                    </button>

                </form>

            </div>

        </div>
    );
}

export default RecuperarSenha;