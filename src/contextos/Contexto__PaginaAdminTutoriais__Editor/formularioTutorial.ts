import { defineFormularioCreate } from 'Hooks/useFormularioCreate';

// Etapa 8: metadados do Tutorial no formulário oficial (nome/chave texto; ativo checkbox). chaveTutorial fica somente leitura na edição e não entra no payload de edição.
export type FormularioTutorial = { nome: string; chaveTutorial: string; ativo: boolean };

export const FORMULARIO_TUTORIAL = defineFormularioCreate<FormularioTutorial>({
    valoresIniciais: { nome: '', chaveTutorial: '', ativo: true },
    campos: {
        nome: { tipo: 'text', label: 'Nome', obrigatorio: true, maxLength: 120, placeholder: 'Nome do Tutorial' },
        chaveTutorial: { tipo: 'text', label: 'Chave', obrigatorio: true, maxLength: 120, placeholder: 'ex.: boas_vindas' },
        ativo: { tipo: 'checkbox', label: 'Ativo' },
    },
});
