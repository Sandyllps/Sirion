import { useEffect, useState } from "react";
import EditarZona from "../../componentes/EditarZona/EditarZona";
import Cabecalho from "../../componentes/Cabecalho/Cabecalho";
import MenuZonas from "../../componentes/MenuZonas/MenuZonas";
import PainelLateral from "../../componentes/ConteudoDashboard/ConteudoDashboard";

import "./Dashboard.css";

function Dashboard(){

    const [menuAberto, setMenuAberto] = useState(true);
    const [modalZonaAberto, setModalZonaAberto] = useState(false);
    const [modoModal, setModoModal] = useState("editar");
    const [dadosDashboard, setDadosDashboard] = useState(null);
    const [zonaSelecionada, setZonaSelecionada] = useState(null);

    useEffect(() => {
        buscarDashboard();
    }, []);

    function alterarMenu(){
        setMenuAberto(!menuAberto);
    }

    function abrirEditarZona(){
        setModoModal("editar");
        setModalZonaAberto(true);
    }

    function abrirNovaZona(){
        setModoModal("nova");
        setModalZonaAberto(true);
    }

    function fecharModalZona(){
        setModalZonaAberto(false);
    }

    async function buscarDashboard() {
        try {
            const resposta = await fetch("http://localhost:8080/dashboard");
            const dados = await resposta.json();
            setDadosDashboard(dados);
            if(dados?.zonas?.length){
                setZonaSelecionada(
                    dados.zonas[0]
                );
            }
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
                    <MenuZonas  
                        zonas={dadosDashboard?.zonas || []}
                        zonaSelecionada={zonaSelecionada}
                        aoSelecionarZona={setZonaSelecionada}
                        aoNovaZona={abrirNovaZona}
                    />
                </div>

                <div className="dashboard-container">
                    <PainelLateral
                        zona={zonaSelecionada}
                        aoEditarZona={abrirEditarZona}
                    />
                </div>

            </div>

            <EditarZona

                zona={zonaSelecionada}
                aberto={modalZonaAberto}
                modo={modoModal}
                aoFechar={fecharModalZona}

            />
        </div>
    );
}

export default Dashboard;