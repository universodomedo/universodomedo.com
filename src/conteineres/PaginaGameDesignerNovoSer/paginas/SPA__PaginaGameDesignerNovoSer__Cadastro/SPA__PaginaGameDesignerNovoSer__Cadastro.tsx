import { ConteudoForm } from 'Componentes/Elementos/ConteudoForm/ConteudoForm';
import InputComRotulo from 'Componentes/Elementos/Inputs/InputComRotulo/InputComRotulo';
import SelecionadorOpcoes, { type OpcaoSelecionador } from 'Componentes/Elementos/Inputs/Selecionadores/SelecionadorOpcoes/SelecionadorOpcoes';
import { useContexto__PaginaGameDesignerNovoSer__Cadastro } from 'Contextos/Contexto__PaginaGameDesignerNovoSer__Cadastro/contexto';

const OPCOES_TIPO: readonly OpcaoSelecionador[] = [
    { value: 'jogavel', label: 'Jogável' },
    { value: 'nao_jogavel', label: 'Não Jogável' },
];

const OPCOES_ORIGEM: readonly OpcaoSelecionador[] = [
    { value: 'humano', label: 'Humano' },
    { value: 'nao_humano', label: 'Não Humano' },
];

export default function SPA__PaginaGameDesignerNovoSer__Cadastro() {
    const { tipo, nome, origemEstrutura, salvando, podeSalvar, setTipo, setNome, setOrigemEstrutura, criar } = useContexto__PaginaGameDesignerNovoSer__Cadastro();

    return (
        <ConteudoForm>
            <ConteudoForm.AreaCorpo>
                <InputComRotulo rotulo="Controlabilidade">
                    <SelecionadorOpcoes opcoes={OPCOES_TIPO} valor={tipo} onChange={valor => setTipo(valor === 'jogavel' || valor === 'nao_jogavel' ? valor : null)} placeholder="Jogável ou Não Jogável" />
                </InputComRotulo>
                {tipo === 'nao_jogavel' && (
                    <InputComRotulo rotulo="Nome">
                        <input type="text" value={nome} onChange={e => setNome(e.target.value)} placeholder="Nome do Ser não jogável" />
                    </InputComRotulo>
                )}
                {tipo === 'jogavel' && (
                    <InputComRotulo rotulo="Estrutura">
                        <SelecionadorOpcoes opcoes={OPCOES_ORIGEM} valor={origemEstrutura} onChange={valor => setOrigemEstrutura(valor === 'humano' || valor === 'nao_humano' ? valor : null)} placeholder="Humano ou Não Humano" />
                    </InputComRotulo>
                )}
            </ConteudoForm.AreaCorpo>
            <ConteudoForm.AreaBotoes>
                <button type="button" onClick={criar} disabled={!podeSalvar}>{salvando ? 'Criando...' : 'Criar Ser'}</button>
            </ConteudoForm.AreaBotoes>
        </ConteudoForm>
    );
};
