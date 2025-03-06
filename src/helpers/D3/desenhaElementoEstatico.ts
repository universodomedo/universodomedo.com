import { select } from 'd3-selection';
import desenhaLinhaDoTempo from 'Helpers/D3/desenhaLinhaDoTempo.ts'
import desenhaEventoNaLinhaDoTempo from 'Helpers/D3/desenhaEventoNaLinhaDoTempo';

export default function desenhaElementoEstatico( rootElement: HTMLDivElement, windowSize: { width: number, height: number }) {
    const { width, height } = windowSize;

    select(rootElement).select('svg').append('rect').attr('width', width).attr('height', height).attr('fill', 'transparent');

    const timelineEvents = [ { color: 'red', title: 'teste1', ts: 1740851395000 }, { color: 'blue', title: 'teste2', ts: 1740937795000 } ];

    desenhaLinhaDoTempo(rootElement, windowSize, timelineEvents);
    desenhaEventoNaLinhaDoTempo(rootElement, windowSize, timelineEvents);
};