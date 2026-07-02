import { useState } from "react";

import Cabecalho from "../../componentes/Cabecalho/Cabecalho";
import MenuZonas from "../../componentes/MenuZonas/MenuZonas";
import PainelLateral from "../../componentes/ConteudoDashboard/ConteudoDashboard";

import "./dashboard.css";

function Dashboard(){

    const [menuAberto, setMenuAberto] = useState(true);

    function alterarMenu(){

        setMenuAberto(!menuAberto);

    }

    return(

        <div className="dashboard">

            <Cabecalho
                aoClicarMenu={alterarMenu}
            />

            <div className="corpo-dashboard">

                {menuAberto && <MenuZonas />}

                <PainelLateral/>

            </div>

        </div>

    );

}

export default Dashboard;