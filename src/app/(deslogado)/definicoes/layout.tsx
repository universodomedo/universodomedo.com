import Breadcrumb from 'Componentes/PaginasGenericas/Breadcrumb';
import { ReactNode } from 'react';

type DefinicoesLayoutProps = {
    children: ReactNode;
};

export default function DefinicoesLayout({ children }: DefinicoesLayoutProps) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', width: '80%', alignContent: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Breadcrumb />

            <div style={{ display: 'flex', flexDirection: 'column', alignContent: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: '4vh' }}>
                {children}
            </div>
        </div>
    );
}