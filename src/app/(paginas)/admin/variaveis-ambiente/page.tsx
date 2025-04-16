'use client';

import { useEffect, useState } from 'react';

import { useContextoAutenticacao } from 'Contextos/ContextoAutenticacao/contexto';
import { VariavelAmbienteDto } from 'types-nora-api';

export default function VariaveisAmbientePage() {
    const { variaveisAmbiente } = useContextoAutenticacao();

    const [variaveis, setVariaveis] = useState<VariavelAmbienteDto[]>([]);
    const [modalAberto, setModalAberto] = useState(false);
    const [editando, setEditando] = useState<VariavelAmbienteDto | null>(null);

    const abrirModalCriar = () => {
        setEditando(null);
        setModalAberto(true);
    };

    const abrirModalEditar = (variavel: VariavelAmbienteDto) => {
        setEditando(variavel);
        setModalAberto(true);
    };

    // const excluirVariavel = async (id: number) => {
    //     await axios.delete(`/api/variaveis-ambiente/${id}`);
    //     setVariaveis((v) => v.filter((v) => v.id !== id));
    // };

    // const salvarVariavel = async (variavel: Omit<VariavelAmbiente, 'id'>) => {
    //     if (editando) {
    //         const res = await axios.put(`/api/variaveis-ambiente/${editando.id}`, variavel);
    //         setVariaveis((prev) =>
    //             prev.map((v) => (v.id === editando.id ? res.data : v))
    //         );
    //     } else {
    //         const res = await axios.post(`/api/variaveis-ambiente`, variavel);
    //         setVariaveis((prev) => [...prev, res.data]);
    //     }
    //     setModalAberto(false);
    // };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-semibold">Variáveis de Ambiente</h1>
                <button onClick={abrirModalCriar} className="btn btn-primary">
                    Nova variável
                </button>
            </div>

            <table className="w-full border">
                <thead>
                    <tr>
                        <th className="text-left p-2 border">Chave</th>
                        <th className="text-left p-2 border">Tipo</th>
                        <th className="text-left p-2 border">Valor</th>
                        <th className="text-left p-2 border">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {variaveisAmbiente.map((variavel) => (
                        <tr key={variavel.id}>
                            <td className="p-2 border">{variavel.chave}</td>
                            <td className="p-2 border">{variavel.tipo}</td>
                            <td className="p-2 border">
                                {typeof variavel.valor === 'object'
                                    ? JSON.stringify(variavel.valor)
                                    : String(variavel.valor)}
                            </td>
                            <td className="p-2 border">
                                <button
                                    className="text-blue-600 mr-2"
                                    onClick={() => abrirModalEditar(variavel)}
                                >
                                    Editar
                                </button>
                                <button
                                    className="text-red-600"
                                    onClick={() => {}}
                                    // onClick={() => excluirVariavel(variavel.id)}
                                >
                                    Remover
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* {modalAberto && (
                <ModalFormularioVariavel
                    onClose={() => setModalAberto(false)}
                    onSave={salvarVariavel}
                    variavel={editando}
                />
            )} */}
        </div>
    );
}