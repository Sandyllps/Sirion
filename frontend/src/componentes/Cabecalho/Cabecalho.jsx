import "./cabecalho.css";

function Cabecalho({ aoClicarMenu }) {
    return (
        <header className="cabecalho">

            <button
                className="botao-menu"
                onClick={aoClicarMenu}
            >
                ☰
            </button>

            <div className="titulo-sistema">
                <h1>Sirion</h1>
                <span>Sistema de Irrigação Inteligente</span>
            </div>

            <div className="status-sistema">
                <span>● Sistema Online</span>
            </div>

        </header>
    );
}

export default Cabecalho;