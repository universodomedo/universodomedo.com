import { LayoutContextualizado } from "Componentes/ElementosVisuais/LayoutContextualizado/LayoutContextualizado";

export default function PaginaTeste1Menu() {
    return (
        <div style={{ display: 'flex', flexDirection: 'row', width: '100%', height: '100%' }}>
            <div style={{ display: 'flex', flexDirection: 'column', flex: 0.85, alignItems: 'center' }}>
                <h1>Pagina 2</h1>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', flex: 0.15 }}>
                <span>Item1</span>
                <span>Item2</span>
                <span>Item3</span>
            </div>
        </div>
    );
}