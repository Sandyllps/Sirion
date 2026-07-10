import "./menuZonas.css";

function MenuZonas({zonas, zonaSelecionada, aoSelecionarZona, aoNovaZona, aoExcluirZona}) {

    function obterIdZona(zona) {
        return zona?._id || zona?.id || zona?.esp32?.chave_esp;
    }

    function zonaEstaSelecionada(zona) {
        return obterIdZona(zona) === obterIdZona(zonaSelecionada);
    }

    function excluir(evento, zona) {
        evento.stopPropagation();

        if (aoExcluirZona) {
            aoExcluirZona(zona);
        }
    }


    return(
        <aside className="menu-zonas">
            <h2>Minhas Zonas</h2>

            <ul className="lista-zonas">
                {zonas.map((zona) => (
                    <li
                        key={obterIdZona(zona)}
                        className={
                            zonaEstaSelecionada(zona)
                                ? "zona-item selecionada"
                                : "zona-item"
                        }
                        onClick={() => aoSelecionarZona(zona)}
                    >
                        <span className="nome-zona">
                            {zona.nome}
                        </span>

                        <button
                            type="button"
                            className="botao-excluir-zona"
                            onClick={(evento) => excluir(evento, zona)}
                            aria-label={`Excluir a zona ${zona.nome}`}
                            title="Excluir zona"
                        >
                            ✕
                        </button>
                    </li>
                ))}
            </ul>

            <button
                type="button"
                className="botao-nova-zona"
                onClick={aoNovaZona}
            >
                + Nova Zona
            </button>
        </aside>
    );
}

export default MenuZonas;