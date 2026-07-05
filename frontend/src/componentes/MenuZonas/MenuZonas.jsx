import "./menuZonas.css";

function MenuZonas() {

    const zonas = [
        "Jardim Principal",
    ];

    return(

        <aside className="menu-zonas">

            <h2>Minhas Zonas</h2>

            <ul>

                {zonas.map((zona, indice)=>(
                    <li key={indice}>
                        {zona}
                    </li>
                ))}

            </ul>

            <button className="botao-nova-zona">
                + Nova Zona
            </button>

        </aside>

    );

}

export default MenuZonas;