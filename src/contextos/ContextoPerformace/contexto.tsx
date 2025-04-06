"use client";

import { createContext, useContext, useState, useEffect } from "react";

interface ContextoPerformanceProps {
    animacoesHabilitadas: boolean;
    setAnimacoesHabilitadas: (enabled: boolean) => void;
};

type WebGLContext = WebGLRenderingContext | WebGL2RenderingContext;
function getWebGLContext(): WebGLContext | null {
    try {
        const canvas = document.createElement("canvas");
        return (
            canvas.getContext("webgl") ||
            canvas.getContext("experimental-webgl") ||
            canvas.getContext("webgl2")
        ) as WebGLContext | null;
    } catch {
        return null;
    }
}

const ContextoPerformance = createContext<ContextoPerformanceProps | undefined>(undefined);

export const useContextoPerformance = (): ContextoPerformanceProps => {
    const context = useContext(ContextoPerformance);
    if (!context) throw new Error('useContextoPerformance precisa estar dentro de um ContextoPerformance');
    return context;
};

export function ContextoPerformanceProvider({ children }: { children: React.ReactNode }) {
    const [animacoesHabilitadas, setAnimacoesHabilitadas] = useState(true);

    useEffect(() => {
        const verificarPerformance = () => {
            const gl = getWebGLContext();

            if (!gl) {
                setAnimacoesHabilitadas(false);
                return;
            }

            // Verificação de aceleração de hardware
            let webglAcelerado = false;
            try {
                const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
                if (debugInfo) {
                    const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) as string;
                    webglAcelerado = !/SwiftShader|LLVM|Software/i.test(renderer);
                } else {
                    // Fallback para navegadores sem a extensão de debug
                    webglAcelerado = testarPerformanceWebGL(gl);
                }
            } catch {
                webglAcelerado = false;
            }

            const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            setAnimacoesHabilitadas(webglAcelerado && !prefersReducedMotion);
        };

        verificarPerformance();
    }, []);

    return (
        <ContextoPerformance.Provider value={{ animacoesHabilitadas, setAnimacoesHabilitadas }} >
            {children}
        </ContextoPerformance.Provider>
    );
}

function testarPerformanceWebGL(gl: WebGLContext): boolean {
    try {
        const start = performance.now();
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(4), gl.STATIC_DRAW);
        const tempo = performance.now() - start;
        gl.deleteBuffer(buffer);
        return tempo < 3;
    } catch {
        return false;
    }
}