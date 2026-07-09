import "./cabecalho.css";

function Cabecalho({ menuAberto, aoClicarMenu }) {

    return (

        <header className="cabecalho">

            <button
                className="botao-menu"
                onClick={aoClicarMenu}
            >
                {menuAberto ? "←" : "☰"}
            </button>

            <div className="titulo-sistema">

                <h1>Sirion</h1>

                <span>Sistema de Irrigação Inteligente</span>

            </div>

            <div className="perfil">

                Perfil

            </div>

        </header>

    );

}

export default Cabecalho;