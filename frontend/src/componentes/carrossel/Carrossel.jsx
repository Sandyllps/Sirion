import { useEffect, useState } from "react";
import "./Carrossel.css";

function Carrossel() {

    const imagens = [
        "/imagens/login/hortinha.jpg",
        "/imagens/login/hortinha1.jpg",
        "/imagens/login/hortinha2.jpg",
        "/imagens/login/hortinha3.jpg",
        "/imagens/login/hortinha4.jpg",
        "/imagens/login/hortinha5.jpg"
    ];

    const [imagemAtual, setImagemAtual] = useState(0);

    useEffect(() => {

        const intervalo = setInterval(() => {

            setImagemAtual((valorAtual) =>

                valorAtual === imagens.length - 1
                    ? 0
                    : valorAtual + 1

            );

        }, 4000);

        return () => clearInterval(intervalo);

    }, []);

    return (

        <div className="carrossel">

            {imagens.map((imagem, indice) => (

                <img

                    key={indice}

                    src={imagem}

                    className={
                        indice === imagemAtual
                            ? "imagem ativa"
                            : "imagem"
                    }

                    alt="Imagem da horta"

                />

            ))}

        </div>

    );

}

export default Carrossel;