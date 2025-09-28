'use client';

import { useEditor, JSONContent } from '@tiptap/react';

import { ExtensoesPadraoTiptap } from 'Uteis/ExtensoesPadraoTiptap/ExtensoesPadraoTiptap';
import AreaTiptap from 'Componentes/Elementos/Tiptap/AreaTiptap/AreaTiptap';

export default function VisualizadorConteudoTiptap({ conteudo }: { conteudo: JSONContent }) {
  const editor = useEditor({
    extensions: ExtensoesPadraoTiptap,
    content: conteudo,
    editable: false,
    immediatelyRender: false,
  });

  if (!editor) return null;

  return (
    <AreaTiptap editor={editor} visualizacao/>
  );
};