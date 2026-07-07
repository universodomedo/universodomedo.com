'use client';

import { Contexto__PaginaGameDesignerEstruturaSerHumano__Provider } from 'Contextos/Contexto__PaginaGameDesignerEstruturaSerHumano/contexto';
import SPA__PaginaGameDesignerEstruturaSerHumano from 'Conteineres/PaginaGameDesignerEstruturaSerHumano/paginas/SPA__PaginaGameDesignerEstruturaSerHumano/SPA__PaginaGameDesignerEstruturaSerHumano';

export default function Conteiner__PaginaGameDesignerEstruturaSerHumano() {
    return (
        <Contexto__PaginaGameDesignerEstruturaSerHumano__Provider>
            <SPA__PaginaGameDesignerEstruturaSerHumano />
        </Contexto__PaginaGameDesignerEstruturaSerHumano__Provider>
    );
};
