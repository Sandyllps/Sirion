import { useEffect, useState } from "react";
import EditarZona from "../../componentes/EditarZona/EditarZona";
import Cabecalho from "../../componentes/Cabecalho/Cabecalho";
import MenuZonas from "../../componentes/MenuZonas/MenuZonas";
import PainelLateral from "../../componentes/ConteudoDashboard/ConteudoDashboard";

import "./Dashboard.css";

function Dashboard(){

    const [menuAberto, setMenuAberto] = useState(true);
    const [editarZonaAberto, setEditarZonaAberto] = useState(false);
    const [dadosDashboard, setDadosDashboard] = useState(null);

    useEffect(() => {
        buscarDashboard();
    }, []);

    function alterarMenu(){
        setMenuAberto(!menuAberto);
    }

    function abrirEditarZona(){

        setEditarZonaAberto(true);

    }

    function fecharEditarZona(){

        setEditarZonaAberto(false);

    }

    async function buscarDashboard() {

        try {
            const resposta = await fetch("http://localhost:8080/dashboard");
            const dados = await resposta.json();
            setDadosDashboard(dados);
        }

        catch (erro) {
            console.error("Erro ao buscar dashboard:", erro);
        }

    }

    return(

        <div className="dashboard">
            <Cabecalho
                aoClicarMenu={alterarMenu}
            />

            <div className="corpo-dashboard">
    
                <div className={`sidebar ${menuAberto ? "aberta" : "fechada"}`}>
                    <MenuZonas />
                </div>

                <div className="dashboard-container">
                    <PainelLateral
                        dados={dadosDashboard}
                        aoEditarZona={abrirEditarZona}
                    />
                </div>

            </div>

            <EditarZona

                aberto={editarZonaAberto}

                aoFechar={fecharEditarZona}

            />

        </div>
    );
}

export default Dashboard;