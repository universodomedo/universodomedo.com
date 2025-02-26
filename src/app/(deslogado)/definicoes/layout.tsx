import Breadcrumb from 'Componentes/PaginasGenericas/Breadcrumb';
import { ReactNode } from 'react';

type DefinicoesLayoutProps = {
    children: ReactNode;
};

export default function DefinicoesLayout({ children }: DefinicoesLayoutProps) {
    return (
        <div>
            <Breadcrumb />

            <div style={{ padding: '20px' }}>
                {children}
            </div>
        </div>
    );
}