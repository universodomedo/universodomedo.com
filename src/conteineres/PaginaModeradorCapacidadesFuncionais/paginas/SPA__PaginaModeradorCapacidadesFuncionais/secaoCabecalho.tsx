import formStyles from './formulario.module.css';

export default function CabecalhoSecaoCapacidadeFuncional({ titulo, onAdicionar, desabilitado }: { titulo: string; onAdicionar: () => void; desabilitado?: boolean; }) {
    return (
        <header className={formStyles.cabecalho_secao}>
            <h3>{titulo}</h3>
            <button type="button" onClick={onAdicionar} disabled={desabilitado === true}>Adicionar</button>
        </header>
    );
};
