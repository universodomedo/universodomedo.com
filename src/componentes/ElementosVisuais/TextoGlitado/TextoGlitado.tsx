'use client';

import styles from './styles.module.css';
import { useEffect, useState } from "react";

import Tooltip from 'componentes/Elementos/Tooltip/Tooltip.tsx';

export default function TextoGlitado({ chaveRequisito, tamanho = "pequeno" }: { chaveRequisito: string, tamanho?: "pequeno" | "grande" }) {
    const comprimentoTextoGlitado = tamanho === "grande" ? 90 : 20;

    // Percentuais e durações independentes para cada efeito
    const porcentagemGlitch = 0.2;
    const porcentagemShake = 0.3;
    const porcentagemSombra = 0.4;

    const duracaoMinimaShake = 1000;
    const variacaoDuracaoShake = 2000;
    const duracaoMinimaSombra = 1500;
    const variacaoDuracaoSombra = 3000;

    const maxLetrasGlitch = Math.ceil(comprimentoTextoGlitado * porcentagemGlitch);

    const [textoGlitado, setTextoGlitado] = useState<string[]>([]);
    const [letrasEmGlitch, setLetrasEmGlitch] = useState(new Set<number>());
    const [letrasShake, setLetrasShake] = useState(new Set<number>());
    const [letrasSombra, setLetrasSombra] = useState(new Set<number>());

    const geraTextoGlitado = (length: number) => {
        return Array.from({ length }, () =>
            String.fromCharCode(33 + Math.random() * 94)
        );
    };

    useEffect(() => {
        setTextoGlitado(geraTextoGlitado(comprimentoTextoGlitado));

        const iniciarGlitch = () => {
            if (letrasEmGlitch.size < maxLetrasGlitch) {
                const novasLetras = new Set(letrasEmGlitch);
                let novaLetra;

                do {
                    novaLetra = Math.floor(Math.random() * comprimentoTextoGlitado);
                } while (novasLetras.has(novaLetra));

                novasLetras.add(novaLetra);
                setLetrasEmGlitch(new Set(novasLetras));

                setTimeout(() => {
                    setTextoGlitado(prev => {
                        const novoTexto = [...prev];
                        novoTexto[novaLetra] = String.fromCharCode(33 + Math.random() * 94);
                        return novoTexto;
                    });

                    novasLetras.delete(novaLetra);
                    setLetrasEmGlitch(new Set(novasLetras));

                    setTimeout(iniciarGlitch, 900 + Math.random() * 1100);
                }, 900 + Math.random() * 1100);
            }
        };

        for (let i = 0; i < maxLetrasGlitch; i++) {
            setTimeout(iniciarGlitch, Math.random() * 2000);
        }

        const aplicarShake = () => {
            const novasLetrasShake = new Set<number>();
            for (let i = 0; i < Math.ceil(comprimentoTextoGlitado * porcentagemShake); i++) {
                novasLetrasShake.add(Math.floor(Math.random() * comprimentoTextoGlitado));
            }
            setLetrasShake(novasLetrasShake);
            setTimeout(aplicarShake, duracaoMinimaShake + Math.random() * variacaoDuracaoShake);
        };

        const aplicarSombra = () => {
            const novasLetrasSombra = new Set<number>();
            for (let i = 0; i < Math.ceil(comprimentoTextoGlitado * porcentagemSombra); i++) {
                novasLetrasSombra.add(Math.floor(Math.random() * comprimentoTextoGlitado));
            }
            setLetrasSombra(novasLetrasSombra);
            setTimeout(aplicarSombra, duracaoMinimaSombra + Math.random() * variacaoDuracaoSombra);
        };

        setTimeout(aplicarShake, Math.random() * 1000);
        setTimeout(aplicarSombra, Math.random() * 1500);

    }, [tamanho]);

    return (
        <Tooltip>
            <Tooltip.Trigger>
                <p className={styles.texto_glitado}>
                    {textoGlitado.map((char, index) => {
                        let classe = "";
                        if (letrasEmGlitch.has(index)) classe += ` ${styles.letra_glitada}`;
                        if (letrasShake.has(index)) classe += ` ${styles.letra_shake}`;
                        if (letrasSombra.has(index)) classe += ` ${styles.letra_sombra}`;

                        return (
                            <span key={index} className={classe.trim()}>
                                {char}
                            </span>
                        );
                    })}
                </p>
            </Tooltip.Trigger>

            <Tooltip.Content>
                <h1>Requerimento de Chave de Acesso encontrada: Código {chaveRequisito}</h1>
            </Tooltip.Content>
        </Tooltip>
    );
}