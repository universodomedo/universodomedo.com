'use client';

import styles from './styles.module.css';
import React, { useCallback } from "react";

import { useEditor } from "@tiptap/react";
import type { JSONContent } from '@tiptap/react';

import { ExtensoesPadraoTiptap } from 'Uteis/ExtensoesPadraoTiptap/ExtensoesPadraoTiptap';
import ToolbarTiptap from 'Componentes/Elementos/Tiptap/ToolbarTiptap/ToolbarTiptap';
import AreaTiptap from 'Componentes/Elementos/Tiptap/AreaTiptap/AreaTiptap';

export default function InputTextoTiptap({ conteudo, onChange }: { conteudo: JSONContent | null; onChange: (content: JSONContent) => void; }) {
    const editor = useEditor({
        extensions: ExtensoesPadraoTiptap,
        content: conteudo,
        onUpdate: ({ editor }) => {
            onChange(editor.getJSON());
        },
        immediatelyRender: false,
    });

    const applyFontSize = useCallback(
        (px: number | null) => {
            if (!editor) return;
            if (px) editor.chain().focus().setMark("textStyle", { fontSize: `${px}px` }).run();
            else editor.chain().focus().setMark("textStyle", { fontSize: undefined as unknown as string }).run();
        }, [editor]
    );

    if (!editor) return null;

    return (
        <div className={styles.editor_wrap}>
            <ToolbarTiptap editor={editor} applyFontSize={applyFontSize} />

            <AreaTiptap editor={editor} />

            {/* 
                <details className={styles.json}>
                    <summary>Conteúdo atual (JSON)</summary>
                    <pre>{JSON.stringify(editor.getJSON(), null, 2)}</pre>
                </details>
            */}
        </div>
    );
};