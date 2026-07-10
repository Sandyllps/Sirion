import "./cabecalho.css";

function Cabecalho({ menuAberto, aoClicarMenu, aoSair }) {
    const nomeUsuario = localStorage.getItem("nome_usuario") || "Perfil";

    function confirmarSaida() {
        const desejaSair = window.confirm(
            "Deseja realmente sair do sistema?"
        );

        if (desejaSair && aoSair) {
            aoSair();
        }
    }

    return (
        <header className="cabecalho">
            <button
                type="button"
                className="botao-menu"
                onClick={aoClicarMenu}
                aria-label={
                    menuAberto
                        ? "Fechar menu lateral"
                        : "Abrir menu lateral"
                }
            >
                {menuAberto ? "←" : "☰"}
            </button>

            <div className="titulo-sistema">
                <h1>Sirion</h1>
                <span>Sistema de Irrigação Inteligente</span>
            </div>

            <button
                type="button"
                className="perfil"
                onClick={confirmarSaida}
                title="Sair do sistema"
            >
                {nomeUsuario}
            </button>
        </header>
    );
}

export default Cabecalho;