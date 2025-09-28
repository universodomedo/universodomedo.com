import styles from './styles.module.css';
import cn from 'classnames';

import { Editor } from '@tiptap/core';
import { EditorContent } from "@tiptap/react";

export default function AreaTiptap({ editor, visualizacao = false }: { editor: Editor; visualizacao?: boolean; }) {
    return (
        <div className={cn(styles.recipiente_editor_tiptap, visualizacao && styles.recipiente_editor_tiptap_visualizador)}>
            <EditorContent editor={editor} />
        </div>
    );
};