import "./menuZonas.css";

function MenuZonas({zonas, zonaSelecionada, aoSelecionarZona,aoNovaZona}) {

    return(

        <aside className="menu-zonas">

            <h2>Minhas Zonas</h2>

            <ul>
                {zonas.map((zona)=>(
                    <li
                        key={zona.chave}
                        className={
                            zonaSelecionada?.chave === zona.chave
                                ? "zona-selecionada"
                                : ""
                        }
                        onClick={() => aoSelecionarZona(zona)}
                    >
                        {zona.nome}
                    </li>
                ))}
            </ul>

            <button className="botao-nova-zona"   onClick={aoNovaZona}>

              + Nova Zona
            </button>

        </aside>

        

    );

}

export default MenuZonas;