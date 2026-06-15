import type { CenarioAnaliseTestePericiaInput, PatentePericiaCompletaDto, ResultadoAnaliseCenarioTestePericia } from 'types-nora-api';

export type CenarioSimuladorTestePericiaUdm = CenarioAnaliseTestePericiaInput & {
    readonly nome: string;
    readonly cor: string;
};

export type AlteracoesCenarioSimuladorTestePericiaUdm = Partial<Pick<CenarioSimuladorTestePericiaUdm, 'nome' | 'cor' | 'valorAtributoBase' | 'incrementoModificadoresAtributo' | 'idPatentePericia' | 'incrementoModificadoresValorMaximo'>>;

export type DadosCenarioSimuladorTestePericiaUdm = {
    readonly cenario: CenarioSimuladorTestePericiaUdm;
    readonly patente: PatentePericiaCompletaDto | null;
    readonly resultado: ResultadoAnaliseCenarioTestePericia | null;
};