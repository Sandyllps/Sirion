import "./cadastro.css";


function Cadastro() {

    return (

        <div className="formulario-cadastro">

            <h1>Seja bem-vindo!</h1>

            <p>Venha fazer parte da Sirion!</p>

            <form>

                <label>Nome</label>
                <input type="text" />

                <label>Email</label>
                <input type="email" />

                <div className="linha-senhas">

                    <div>

                        <label>Senha</label>
                        <input type="password" />

                    </div>

                    <div>

                        <label>Confirmar Senha</label>
                        <input type="password" />

                    </div>

                </div>

                <button className="botao-enviar">

                    Cadastrar

                </button>

            </form>

        </div>

    );

}

export default Cadastro;