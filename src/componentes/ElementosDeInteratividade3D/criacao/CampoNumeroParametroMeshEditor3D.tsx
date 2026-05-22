import styles from './styles.module.css';

interface CampoNumeroParametroMeshEditor3DProps {
    nome: string;
    valor: number;
    passo: number;
    atualizaValor: (valor: number) => void;
};

export function CampoNumeroParametroMeshEditor3D({ nome, valor, passo, atualizaValor }: CampoNumeroParametroMeshEditor3DProps) {
    function alteraValor(valorTexto: string): void {
        const novoValor = Number(valorTexto);

        if (Number.isNaN(novoValor)) return;

        atualizaValor(novoValor);
    };

    return (
        <label className={styles.campoNumeroParametroMesh}>
            <span>{nome}</span>
            <input type="number" value={valor} step={passo} onChange={event => alteraValor(event.target.value)} />
        </label>
    );
};