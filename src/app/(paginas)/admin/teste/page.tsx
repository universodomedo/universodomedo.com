'use client';

import dynamic from "next/dynamic";
import { useState } from "react";

// Carrega o editor dinamicamente (para evitar problemas com SSR)
const MDEditor = dynamic(
    () => import("@uiw/react-md-editor"),
    { ssr: false }
);

export default function RichTextEditor() {
    const [value, setValue] = useState('');

    // Função adaptadora para converter os tipos
    const handleEditorChange = (
        newValue?: string,
        event?: React.ChangeEvent<HTMLTextAreaElement>,
        state?: any
    ) => {
        // Se newValue for undefined, mantemos o valor atual (ou podemos definir como string vazia)
        setValue(newValue || "");
    };

    return (
        <div>
            <MDEditor
                value={value}
                onChange={handleEditorChange}  // Usamos a função adaptadora aqui
                height={300}
                preview="edit"
            />
            {/* <div className="mt-4">
                <h3>Preview:</h3>
                <div className="border p-4 rounded">
                    <ReactMarkdown>{value}</ReactMarkdown>
                </div>
            </div> */}

            <button onClick={() => {console.log(value)}}>Teste</button>
        </div>
    );
}