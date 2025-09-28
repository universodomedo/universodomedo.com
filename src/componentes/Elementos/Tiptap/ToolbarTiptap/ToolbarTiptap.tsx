import styles from './styles.module.css';
import cn from 'classnames';

import { Editor } from '@tiptap/core';
import { useEffect } from 'react';

import { TextAlignLeftIcon, TextAlignCenterIcon, TextAlignRightIcon } from "@radix-ui/react-icons";

// export default function ToolbarTiptap({ editor, applyFontSize }: { editor: Editor; applyFontSize: (px: number | null) => void }) {
export default function ToolbarTiptap({ editor }: { editor: Editor; }) {
    // useEffect(() => {
    //     editor.chain().focus().setColor('black').run();
    // }, []);

    return (
        <div className={styles.recipiente_toolbar_tiptap}>
            <div className={styles.toolbar_tiptap}>
                <select className={cn(styles.ctrl, styles.botao_toolbar)} onChange={(e) => { const val = e.target.value; editor.chain().focus(); if (val === "paragraph") editor.chain().focus().setParagraph().run(); if (val === "h1") editor.chain().focus().toggleHeading({ level: 1 }).run(); if (val === "h2") editor.chain().focus().toggleHeading({ level: 2 }).run(); if (val === "h3") editor.chain().focus().toggleHeading({ level: 3 }).run(); }} value={editor.isActive("heading", { level: 1 }) ? "h1" : editor.isActive("heading", { level: 2 }) ? "h2" : editor.isActive("heading", { level: 3 }) ? "h3" : "paragraph"}>
                    <option value="paragraph">Parágrafo</option>
                    <option value="h1">Título 1</option>
                    <option value="h2">Título 2</option>
                    <option value="h3">Título 3</option>
                </select>

                <button type="button" className={cn(styles.botao_toolbar, editor.isActive("bold") && styles.active)} onClick={() => editor.chain().focus().toggleBold().run()}>B</button>
                <button type="button" className={cn(styles.botao_toolbar, editor.isActive("italic") && styles.active)} onClick={() => editor.chain().focus().toggleItalic().run()}>I</button>
                <button type="button" className={cn(styles.botao_toolbar, editor.isActive("underline") && styles.active)} onClick={() => editor.chain().focus().toggleUnderline().run()}>U</button>

                <button type="button" className={cn(styles.botao_toolbar, editor.isActive("bulletList") && styles.active)} onClick={() => editor.chain().focus().toggleBulletList().run()}>• Lista</button>
                <button type="button" className={cn(styles.botao_toolbar, editor.isActive("orderedList") && styles.active)} onClick={() => editor.chain().focus().toggleOrderedList().run()}>1. Lista</button>

                <button type="button" className={cn(styles.botao_toolbar, editor.isActive({ textAlign: "left" }) && styles.active)} onClick={() => editor.chain().focus().setTextAlign("left").run()}><div className={styles.recipiente_svg_botao_toolbar_tiptap}><TextAlignLeftIcon /></div></button>
                <button type="button" className={cn(styles.botao_toolbar, editor.isActive({ textAlign: "center" }) && styles.active)} onClick={() => editor.chain().focus().setTextAlign("center").run()}><div className={styles.recipiente_svg_botao_toolbar_tiptap}><TextAlignCenterIcon /></div></button>
                <button type="button" className={cn(styles.botao_toolbar, editor.isActive({ textAlign: "right" }) && styles.active)} onClick={() => editor.chain().focus().setTextAlign("right").run()}><div className={styles.recipiente_svg_botao_toolbar_tiptap}><TextAlignRightIcon /></div></button>

                {/* <input type="color" onChange={(e) => editor.chain().focus().setColor(e.target.value).run()} className={cn(styles.color, styles.botao_toolbar)} title="Cor do texto" /> */}

                {/* <select className={cn(styles.ctrl, styles.botao_toolbar)} onChange={(e) => applyFontSize(e.target.value ? Number(e.target.value) : null)} defaultValue="">
                    <option value="">Tamanho</option>
                    <option value="12">12</option>
                    <option value="14">14</option>
                    <option value="16">16</option>
                    <option value="18">18</option>
                    <option value="24">24</option>
                    <option value="32">32</option>
                </select> */}

                {/* 
                <button type="button" className={cn(styles.botao_toolbar)} onClick={() => { const url = prompt("URL do link:"); if (url) editor.chain().focus().setLink({ href: url }).run(); }}>Link</button>
                <button type="button" className={cn(styles.botao_toolbar)} onClick={() => editor.chain().focus().unsetLink().run()}>Remover link</button>
                */}

                <button type="button" className={cn(styles.botao_toolbar)} onClick={() => editor.chain().focus().undo().run()}>↺</button>
                <button type="button" className={cn(styles.botao_toolbar)} onClick={() => editor.chain().focus().redo().run()}>↻</button>

                <button type="button" className={cn(styles.botao_toolbar)} onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}>Limpar</button>
            </div>
        </div>
    );
};