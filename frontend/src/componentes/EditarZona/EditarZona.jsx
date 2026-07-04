import "./editarZona.css";

function EditarZona({

    aberto,
    aoFechar

}) {

    if (!aberto) {

        return null;

    }

    return (

        <section className="fundo-modal">

            <div className="modal-editar-zona">

                <h2>Editar Zona</h2>

                <label>

                    Nome da Zona

                </label>

                <input
                    type="text"
                    placeholder="Digite o nome da zona"
                />

                <label>

                    Tipo de Cultivo

                </label>

                <input
                    type="text"
                    placeholder="Ex.: Alface"
                />

                <label>

                    Umidade Mínima (%)

                </label>

                <input
                    type="number"
                />

                <label>

                    Umidade Máxima (%)

                </label>

                <input
                    type="number"
                />

                <div className="botoes-modal">

                    <button
                        onClick={aoFechar}
                    >

                        Cancelar

                    </button>

                    <button>

                        Salvar

                    </button>

                </div>

            </div>

        </section>

    );

}

export default EditarZona;