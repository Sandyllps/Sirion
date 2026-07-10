import { useState } from "react";

import TelaLogin from "./telas/TelaLogin/TelaLogin";
import TelaCadastro from "./telas/TelaCadastro/TelaCadastro";
import Dashboard from "./telas/TelaPrincipal/Dashboard";

function App() {
    const [usuarioLogado, setUsuarioLogado] = useState(
        Boolean(localStorage.getItem("id_usuario"))
    );

    const [telaAutenticacao, setTelaAutenticacao] = useState("login");

    function abrirLogin() {
        setTelaAutenticacao("login");
    }

    function abrirCadastro() {
        setTelaAutenticacao("cadastro");
    }

    function concluirLogin(dadosUsuario) {
        localStorage.setItem("id_usuario", String(dadosUsuario.id));
        localStorage.setItem("nome_usuario", dadosUsuario.nome);
        localStorage.setItem("email_usuario", dadosUsuario.email);

        setUsuarioLogado(true);
    }

    function sairDoSistema() {
      localStorage.removeItem("id_usuario");
      localStorage.removeItem("nome_usuario");
      localStorage.removeItem("email_usuario");

      setUsuarioLogado(false);
      setTelaAutenticacao("login");
    }

    if (usuarioLogado) {
        return (
            <Dashboard aoSair={sairDoSistema} />
        );
    }

    if (telaAutenticacao === "cadastro") {
        return (
            <TelaCadastro
                aoAbrirLogin={abrirLogin}
                aoAbrirCadastro={abrirCadastro}
            />
        );
    }

    return (
        <TelaLogin
            aoConcluirLogin={concluirLogin}
            aoAbrirLogin={abrirLogin}
            aoAbrirCadastro={abrirCadastro}
        />
    );
}

export default App;