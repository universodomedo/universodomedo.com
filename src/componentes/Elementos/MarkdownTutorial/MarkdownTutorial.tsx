'use client';

import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';

import styles from './MarkdownTutorial.module.css';

// Etapa 9: renderização ÚNICA e reutilizável (prévia do editor + futuro renderizador) do Markdown limitado dos blocos de texto do Tutorial.
// Segurança: SEM rehype-raw e SEM dangerouslySetInnerHTML — HTML embutido nunca é interpretado/executado. Subconjunto permitido via allowedElements; remark-breaks transforma quebra de linha simples em <br>.
const ELEMENTOS_PERMITIDOS = ['p', 'br', 'strong', 'em', 'h1', 'h2', 'h3'];

export default function MarkdownTutorial({ markdown }: { markdown: string }) { return <div className={styles.markdown}><ReactMarkdown remarkPlugins={[remarkBreaks]} allowedElements={ELEMENTOS_PERMITIDOS} unwrapDisallowed>{markdown}</ReactMarkdown></div>; };
