'use client';

import styles from './styles.module.css';

import { useRouter } from 'next/navigation';

import { criaPayloadScreenshotTemporarioEditor3D, obtemBloqueioGeracaoScreenshotTemporarioEditor3D, ROTA_SCREENSHOT_TEMPORARIO_EDITOR_3D, salvaPayloadScreenshotTemporarioEditor3D } from '../screenshot/editor3D.screenshotTemporario';
import { useEditor3DContexto } from '../contexto/Editor3DContexto';

export function PainelScreenshotTemporarioEditor3D() {
    const router = useRouter();
    const { estado, acoes } = useEditor3DContexto();

    function geraScreenshotTemporario(): void {
        const motivoBloqueio = obtemBloqueioGeracaoScreenshotTemporarioEditor3D(estado);

        if (motivoBloqueio !== null) {
            acoes.exibeNotificacaoAreaInterativa(motivoBloqueio);

            return;
        }

        try {
            salvaPayloadScreenshotTemporarioEditor3D(criaPayloadScreenshotTemporarioEditor3D(estado));
            router.push(ROTA_SCREENSHOT_TEMPORARIO_EDITOR_3D);
        } catch (erroCapturado) {
            const mensagemErro = erroCapturado instanceof Error ? erroCapturado.message : 'Erro desconhecido ao preparar screenshot temporario.';

            acoes.exibeNotificacaoAreaInterativa(mensagemErro);
        }
    };

    return (
        <section className={styles.painelScreenshotTemporarioEditor3D} aria-label="Screenshot temporario do Editor 3D">
            <button className={styles.botaoScreenshotTemporarioEditor3D} type="button" onClick={geraScreenshotTemporario}>
                <span>Gerar Screenshot</span>
                <strong>{estado.objetos.length}</strong>
            </button>
        </section>
    );
};
