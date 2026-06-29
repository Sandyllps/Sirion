import "./cadastro.css";


function Cadastro() {
    return (
        <div className="pagina-cadastro">
            
            <div className="container-cadastro">
                <div className="imagem-lateral">
                    <img src="/imagens/login/hortinha.jpg" alt="Hortinha" />
                </div>

                <div className="painel-cadastro">
                    <div className="botoes-laterais">
                        <button className="botao-cadastrar">Cadastrar</button>
                        <button className="botao-login">Login</button>
                    </div>

                    <div className="formulario-cadastro">
                        <h1>Seja bem-vindo!</h1>

                        <p>Venha fazer parte da Sirion!</p>

                        <form>
                            <label>Nome</label>
                            <input type="text"/>

                            <label>Email</label>
                            <input type="email"/>

                            <div className="linha-senhas">

                                <div>
                                    <label>Senha</label>
                                    <input type="password"/>
                                </div>

                                <div>
                                    <label>Confirmar Senha</label>
                                    <input type="password"/>
                                </div>
                            </div>

                            <button className="botao-enviar">Cadastrar</button>
                        
                        </form>
                    </div>
                </div>    
            </div>
       </div>
    );
}

export default Cadastro;