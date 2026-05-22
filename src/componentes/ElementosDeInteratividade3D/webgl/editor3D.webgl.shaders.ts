export const codigoVertexShaderEditor3D = `
    attribute vec3 aPosition;
    attribute vec3 aNormal;
    uniform mat4 uMatriz;
    uniform mat4 uMatrizModelo;
    varying vec3 vNormal;
    varying vec3 vPosicao;
    void main() {
        vec4 posicaoMundo = uMatrizModelo * vec4(aPosition, 1.0);
        vPosicao = posicaoMundo.xyz;
        vNormal = mat3(uMatrizModelo) * aNormal;
        gl_Position = uMatriz * vec4(aPosition, 1.0);
        gl_PointSize = 9.0;
    }
`;

export const codigoFragmentShaderEditor3D = `
    precision mediump float;
    uniform vec3 uCorBase;
    uniform vec3 uCorLuz;
    uniform float uAlpha;
    uniform float uUsaIluminacao;
    varying vec3 vNormal;
    varying vec3 vPosicao;
    void main() {
        vec3 cor = uCorBase;
        if (uUsaIluminacao > 0.5) {
            vec3 normal = normalize(vNormal);
            vec3 luz = normalize(vec3(-0.35, 0.55, 0.76));
            float iluminacao = max(dot(normal, luz), 0.0);
            float brilho = pow(max(dot(reflect(-luz, normal), normalize(-vPosicao)), 0.0), 18.0);
            cor = (uCorBase * 0.28) + (uCorBase * iluminacao * 0.82) + (uCorLuz * brilho * 0.62);
        }
        gl_FragColor = vec4(cor, uAlpha);
    }
`;