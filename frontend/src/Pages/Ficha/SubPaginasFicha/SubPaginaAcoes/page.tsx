// #region Imports
import { Acao } from 'Types/classes/index.ts';
import { useLoading } from "Components/LayoutAbas/hooks.ts";
import { Consulta, ConsultaProvider } from "Components/ConsultaFicha/page.tsx";

import IconeCustomizado from "Components/IconeCustomizado/page.tsx";
// #endregion

const page: React.FC<{ abaId: string; acoesPersonagem: Acao[] }> = ({ abaId, acoesPersonagem }) => {
  const { stopLoading } = useLoading();

  const acoesRealizaveis = acoesPersonagem.filter(acao => !acao.bloqueada);
  const acoesBloqueadas = acoesPersonagem.filter(acao => acao.bloqueada);

  const renderAcaoItem = (acao: Acao, index: number) => (
    <IconeCustomizado key={index} tooltipProps={acao.tooltipProps} desabilitado={acao.bloqueada} textoBotaoConfirmar={'Executar'} opcoes={acao.opcoesExecucoes} exec={{ executaEmModal: true, func: (valoresSelecionados: any) => acao.executaComOpcoes(valoresSelecionados) }}  />
  );

  return (
    <>
      <ConsultaProvider<Acao> abaId={abaId} registros={[acoesRealizaveis, acoesBloqueadas]} filtroProps={Acao.filtroProps} onLoadComplete={stopLoading} tituloDivisoesConsulta={{ usaSubtitulos: true, divisoes: ['Ações Realizáveis', 'Ações Bloqueadas'] }}>
        <Consulta renderItem={renderAcaoItem} />
      </ConsultaProvider>
    </>
  );
};

export default page;