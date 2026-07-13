import { useEffect, useState } from "react";
import { buscarZonasPorUsuario, buscarDadosDashboard } from "../../api";

import EditarZona from "../../componentes/EditarZona/EditarZona";
import Cabecalho from "../../componentes/Cabecalho/Cabecalho";
import MenuZonas from "../../componentes/MenuZonas/MenuZonas";
import PainelLateral from "../../componentes/ConteudoDashboard/ConteudoDashboard";


import "./dashboard.css";

function Dashboard({ aoSair }) {

    const [menuAberto, setMenuAberto] = useState(true);
    const [modalZonaAberto, setModalZonaAberto] = useState(false);
    const [modoModal, setModoModal] = useState("editar");
    const [dadosDashboard, setDadosDashboard] = useState(null);
    const [zonaSelecionada, setZonaSelecionada] = useState(null);
    const [dadosZona, setDadosZona] = useState(null);
    const idUsuario = localStorage.getItem("id_usuario");

    useEffect(() => {
        buscarDashboard();
    }, []);

    useEffect(() => {
        if (!zonaSelecionada) {
            setDadosZona(null);
            return;
        }

        const chaveEsp =
            zonaSelecionada.esp32?.chave_esp ||
            zonaSelecionada.chave_esp ||
            zonaSelecionada.chave;

        if (!chaveEsp) {
            console.error("A zona selecionada não possui chave ESP32.");
            setDadosZona(null);
            return;
        }

        let componenteAtivo = true;

        async function carregarDadosZona() {
            try {
                const dados = await buscarDadosDashboard(chaveEsp);

                if (componenteAtivo) {
                    setDadosZona(dados);
                }
            } catch (erro) {
                console.error(
                    "Erro ao carregar dados da zona selecionada:",
                    erro
                );

                if (componenteAtivo) {
                    setDadosZona(null);
                }
            }
        }

        carregarDadosZona();

        const intervalo = setInterval(
            carregarDadosZona,
            5000
        );

        return () => {
            componenteAtivo = false;
            clearInterval(intervalo);
        };
    }, [zonaSelecionada]);

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

    function atualizarDashboard() {
        buscarDashboard();
    }

    async function removerZona(zona) {
        const idZona = zona?._id || zona?.id;

        if (!idZona) {
            alert("Não foi possível identificar a zona.");
            return;
        }

        const desejaExcluir = window.confirm(
            `Deseja realmente excluir a zona "${zona.nome}"?`
        );

        if (!desejaExcluir) {
            return;
        }

        try {
            await excluirZona(idZona);

            if (
                zonaSelecionada?._id === idZona ||
                zonaSelecionada?.id === idZona
            ) {
                setZonaSelecionada(null);
            }

            await buscarDashboard();
        } catch (erro) {
            console.error("Erro ao excluir zona:", erro);
            alert(erro.message);
        }
    }

    async function buscarDashboard() {
        if (!idUsuario) {
            console.error("Nenhum usuário autenticado.");
            return;
        }

        try {
            const zonas = await buscarZonasPorUsuario(idUsuario);

            setDadosDashboard({
                zonas
            });

            if (zonas.length > 0) {
                setZonaSelecionada((zonaAtual) => {
                    if (!zonaAtual) {
                        return zonas[0];
                    }

                    return (
                        zonas.find(
                            (zona) =>
                                zona._id === zonaAtual._id || zona.chave === zonaAtual.chave
                        ) || zonas[0]
                    );
                });
            } else {
                setZonaSelecionada(null);
            }
        } catch (erro) {
            console.error("Erro ao buscar zonas:", erro);
        }
    }

    return(

        <div className="dashboard">
            <Cabecalho
                menuAberto={menuAberto}
                aoClicarMenu={alterarMenu}
                aoSair={aoSair}
            />
            
            <div className="corpo-dashboard">
    
                <div className={`sidebar ${menuAberto ? "aberta" : "fechada"}`}>
                    <MenuZonas  
                        zonas={dadosDashboard?.zonas || []}
                        zonaSelecionada={zonaSelecionada}
                        aoSelecionarZona={setZonaSelecionada}
                        aoNovaZona={abrirNovaZona}
                        aoExcluirZona={removerZona}
                    />
                </div>

                <div className="dashboard-container">
                    <PainelLateral
                        zona={zonaSelecionada}
                        dadosZona={dadosZona}
                        aoEditarZona={abrirEditarZona}
                    />
                </div>

            </div>

            <EditarZona
                zona={zonaSelecionada}
                aberto={modalZonaAberto}
                modo={modoModal}
                idUsuario={idUsuario}
                aoFechar={fecharModalZona}
                aoAtualizar={atualizarDashboard}
            />
        </div>
    );
}

export default Dashboard;