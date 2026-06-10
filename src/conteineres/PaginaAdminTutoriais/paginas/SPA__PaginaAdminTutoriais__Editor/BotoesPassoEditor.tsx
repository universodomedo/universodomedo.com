import styles from './BotoesPassoEditor.module.css';

import type { CampoTextoBotaoTutorial, PassoLocalTutorial } from 'Contextos/Contexto__PaginaAdminTutoriais__Editor/tutorialEditor.types';

const CAMPOS_BOTAO: readonly { campo: CampoTextoBotaoTutorial; label: string; fallback: string }[] = [
    { campo: 'textoBotaoVoltar', label: 'Voltar', fallback: 'Voltar' },
    { campo: 'textoBotaoAvancar', label: 'Avançar', fallback: 'Avançar' },
    { campo: 'textoBotaoConcluir', label: 'Concluir', fallback: 'Entendi' },
    { campo: 'textoBotaoFechar', label: 'Fechar', fallback: 'Fechar' },
];

type BotoesPassoEditorProps = { passo: PassoLocalTutorial; aoAtualizar: (campo: CampoTextoBotaoTutorial, valor: string) => void };

export default function BotoesPassoEditor({ passo, aoAtualizar }: BotoesPassoEditorProps) {
    return (
        <div className={styles.botoes}>
            {CAMPOS_BOTAO.map(({ campo, label, fallback }) => (
                <label key={campo} className={styles.campo}>
                    <span>{label}</span>
                    <input type="text" value={passo[campo] ?? ''} placeholder={fallback} maxLength={40} onChange={evento => aoAtualizar(campo, evento.target.value)} />
                </label>
            ))}
        </div>
    );
};
