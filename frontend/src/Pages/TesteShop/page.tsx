// #region Imports
import style from "./style.module.css";
import { useState } from 'react';
import { Item, ItemEquipamento, NomeItem, BuffExterno, DetalhesItemEquipamento, ItemComponente, DetalhesItemComponente } from 'Types/classes.tsx';
import { FichaHelper } from "Types/classes_estaticas.tsx";
// #endregion

interface RowData { id: number; name: string; }

const page = () => {
    const [selectedRowId, setSelectedRowId] = useState<number | null>(null);

    const data: RowData[] = [
        { id: 1, name: 'Vestimenta Simples de Acrobacia' },
        { id: 2, name: 'Vestimenta Simples de Crime' },
        { id: 3, name: 'Vestimenta Simples de Furtividade' },
        { id: 4, name: 'Vestimenta Simples de Iniciativa' },
        { id: 5, name: 'Vestimenta Simples de Pontaria' },
        { id: 6, name: 'Vestimenta Simples de Reflexo' },
        { id: 7, name: 'Vestimenta Simples de Atletismo' },
        { id: 8, name: 'Vestimenta Simples de Luta' },
        { id: 9, name: 'Vestimenta Simples de Adestramento' },
        { id: 10, name: 'Vestimenta Simples de Artes' },
        { id: 11, name: 'Vestimenta Simples de Atualidades' },
        { id: 12, name: 'Vestimenta Simples de Ciências' },
        { id: 13, name: 'Vestimenta Simples de Engenharia' },
        { id: 14, name: 'Vestimenta Simples de Investigação' },
        { id: 15, name: 'Vestimenta Simples de Medicina' },
        { id: 16, name: 'Vestimenta Simples de Ocultista' },
        { id: 17, name: 'Vestimenta Simples de Sobrevivência' },
        { id: 18, name: 'Vestimenta Simples de Tatica' },
        { id: 19, name: 'Vestimenta Simples de Tecnologia' },
        { id: 20, name: 'Vestimenta Simples de Diplomacia' },
        { id: 21, name: 'Vestimenta Simples de Enganação' },
        { id: 22, name: 'Vestimenta Simples de Intimidação' },
        { id: 23, name: 'Vestimenta Simples de Intuição' },
        { id: 24, name: 'Vestimenta Simples de Percepção' },
        { id: 25, name: 'Vestimenta Simples de Vontade' },
        { id: 26, name: 'Vestimenta Simples de Fortitude' },
        { id: 27, name: 'Utensílio Simples de Acrobacia' },
        { id: 28, name: 'Utensílio Simples de Crime' },
        { id: 29, name: 'Utensílio Simples de Furtividade' },
        { id: 30, name: 'Utensílio Simples de Iniciativa' },
        { id: 31, name: 'Utensílio Simples de Pontaria' },
        { id: 32, name: 'Utensílio Simples de Reflexo' },
        { id: 33, name: 'Utensílio Simples de Atletismo' },
        { id: 34, name: 'Utensílio Simples de Luta' },
        { id: 35, name: 'Utensílio Simples de Adestramento' },
        { id: 36, name: 'Utensílio Simples de Artes' },
        { id: 37, name: 'Utensílio Simples de Atualidades' },
        { id: 38, name: 'Utensílio Simples de Ciências' },
        { id: 39, name: 'Utensílio Simples de Engenharia' },
        { id: 40, name: 'Utensílio Simples de Investigação' },
        { id: 41, name: 'Utensílio Simples de Medicina' },
        { id: 42, name: 'Utensílio Simples de Ocultista' },
        { id: 43, name: 'Utensílio Simples de Sobrevivência' },
        { id: 44, name: 'Utensílio Simples de Tatica' },
        { id: 45, name: 'Utensílio Simples de Tecnologia' },
        { id: 46, name: 'Utensílio Simples de Diplomacia' },
        { id: 47, name: 'Utensílio Simples de Enganação' },
        { id: 48, name: 'Utensílio Simples de Intimidação' },
        { id: 49, name: 'Utensílio Simples de Intuição' },
        { id: 50, name: 'Utensílio Simples de Percepção' },
        { id: 51, name: 'Utensílio Simples de Vontade' },
        { id: 52, name: 'Utensílio Simples de Fortitude' },
        { id: 53, name: 'Vestimenta Complexa de Acrobacia' },
        { id: 54, name: 'Vestimenta Complexa de Crime' },
        { id: 55, name: 'Vestimenta Complexa de Furtividade' },
        { id: 56, name: 'Vestimenta Complexa de Iniciativa' },
        { id: 57, name: 'Vestimenta Complexa de Pontaria' },
        { id: 58, name: 'Vestimenta Complexa de Reflexo' },
        { id: 59, name: 'Vestimenta Complexa de Atletismo' },
        { id: 60, name: 'Vestimenta Complexa de Luta' },
        { id: 61, name: 'Vestimenta Complexa de Adestramento' },
        { id: 62, name: 'Vestimenta Complexa de Artes' },
        { id: 63, name: 'Vestimenta Complexa de Atualidades' },
        { id: 64, name: 'Vestimenta Complexa de Ciências' },
        { id: 65, name: 'Vestimenta Complexa de Engenharia' },
        { id: 66, name: 'Vestimenta Complexa de Investigação' },
        { id: 67, name: 'Vestimenta Complexa de Medicina' },
        { id: 68, name: 'Vestimenta Complexa de Ocultista' },
        { id: 69, name: 'Vestimenta Complexa de Sobrevivência' },
        { id: 70, name: 'Vestimenta Complexa de Tatica' },
        { id: 71, name: 'Vestimenta Complexa de Tecnologia' },
        { id: 72, name: 'Vestimenta Complexa de Diplomacia' },
        { id: 73, name: 'Vestimenta Complexa de Enganação' },
        { id: 74, name: 'Vestimenta Complexa de Intimidação' },
        { id: 75, name: 'Vestimenta Complexa de Intuição' },
        { id: 76, name: 'Vestimenta Complexa de Percepção' },
        { id: 77, name: 'Vestimenta Complexa de Vontade' },
        { id: 78, name: 'Vestimenta Complexa de Fortitude' },
        { id: 79, name: 'Utensílio Complexo de Acrobacia' },
        { id: 80, name: 'Utensílio Complexo de Crime' },
        { id: 81, name: 'Utensílio Complexo de Furtividade' },
        { id: 82, name: 'Utensílio Complexo de Iniciativa' },
        { id: 83, name: 'Utensílio Complexo de Pontaria' },
        { id: 84, name: 'Utensílio Complexo de Reflexo' },
        { id: 85, name: 'Utensílio Complexo de Atletismo' },
        { id: 86, name: 'Utensílio Complexo de Luta' },
        { id: 87, name: 'Utensílio Complexo de Adestramento' },
        { id: 88, name: 'Utensílio Complexo de Artes' },
        { id: 89, name: 'Utensílio Complexo de Atualidades' },
        { id: 90, name: 'Utensílio Complexo de Ciências' },
        { id: 91, name: 'Utensílio Complexo de Engenharia' },
        { id: 92, name: 'Utensílio Complexo de Investigação' },
        { id: 93, name: 'Utensílio Complexo de Medicina' },
        { id: 94, name: 'Utensílio Complexo de Ocultista' },
        { id: 95, name: 'Utensílio Complexo de Sobrevivência' },
        { id: 96, name: 'Utensílio Complexo de Tatica' },
        { id: 97, name: 'Utensílio Complexo de Tecnologia' },
        { id: 98, name: 'Utensílio Complexo de Diplomacia' },
        { id: 99, name: 'Utensílio Complexo de Enganação' },
        { id: 100, name: 'Utensílio Complexo de Intimidação' },
        { id: 101, name: 'Utensílio Complexo de Intuição' },
        { id: 102, name: 'Utensílio Complexo de Percepção' },
        { id: 103, name: 'Utensílio Complexo de Vontade' },
        { id: 104, name: 'Utensílio Complexo de Fortitude' },
        { id: 105, name: 'Vestimenta Especial de Acrobacia' },
        { id: 106, name: 'Vestimenta Especial de Crime' },
        { id: 107, name: 'Vestimenta Especial de Furtividade' },
        { id: 108, name: 'Vestimenta Especial de Iniciativa' },
        { id: 109, name: 'Vestimenta Especial de Pontaria' },
        { id: 110, name: 'Vestimenta Especial de Reflexo' },
        { id: 111, name: 'Vestimenta Especial de Atletismo' },
        { id: 112, name: 'Vestimenta Especial de Luta' },
        { id: 113, name: 'Vestimenta Especial de Adestramento' },
        { id: 114, name: 'Vestimenta Especial de Artes' },
        { id: 115, name: 'Vestimenta Especial de Atualidades' },
        { id: 116, name: 'Vestimenta Especial de Ciências' },
        { id: 117, name: 'Vestimenta Especial de Engenharia' },
        { id: 118, name: 'Vestimenta Especial de Investigação' },
        { id: 119, name: 'Vestimenta Especial de Medicina' },
        { id: 120, name: 'Vestimenta Especial de Ocultista' },
        { id: 121, name: 'Vestimenta Especial de Sobrevivência' },
        { id: 122, name: 'Vestimenta Especial de Tatica' },
        { id: 123, name: 'Vestimenta Especial de Tecnologia' },
        { id: 124, name: 'Vestimenta Especial de Diplomacia' },
        { id: 125, name: 'Vestimenta Especial de Enganação' },
        { id: 126, name: 'Vestimenta Especial de Intimidação' },
        { id: 127, name: 'Vestimenta Especial de Intuição' },
        { id: 128, name: 'Vestimenta Especial de Percepção' },
        { id: 129, name: 'Vestimenta Especial de Vontade' },
        { id: 130, name: 'Vestimenta Especial de Fortitude' },
        { id: 131, name: 'Utensílio Especial de Acrobacia' },
        { id: 132, name: 'Utensílio Especial de Crime' },
        { id: 133, name: 'Utensílio Especial de Furtividade' },
        { id: 134, name: 'Utensílio Especial de Iniciativa' },
        { id: 135, name: 'Utensílio Especial de Pontaria' },
        { id: 136, name: 'Utensílio Especial de Reflexo' },
        { id: 137, name: 'Utensílio Especial de Atletismo' },
        { id: 138, name: 'Utensílio Especial de Luta' },
        { id: 139, name: 'Utensílio Especial de Adestramento' },
        { id: 140, name: 'Utensílio Especial de Artes' },
        { id: 141, name: 'Utensílio Especial de Atualidades' },
        { id: 142, name: 'Utensílio Especial de Ciências' },
        { id: 143, name: 'Utensílio Especial de Engenharia' },
        { id: 144, name: 'Utensílio Especial de Investigação' },
        { id: 145, name: 'Utensílio Especial de Medicina' },
        { id: 146, name: 'Utensílio Especial de Ocultista' },
        { id: 147, name: 'Utensílio Especial de Sobrevivência' },
        { id: 148, name: 'Utensílio Especial de Tatica' },
        { id: 149, name: 'Utensílio Especial de Tecnologia' },
        { id: 150, name: 'Utensílio Especial de Diplomacia' },
        { id: 151, name: 'Utensílio Especial de Enganação' },
        { id: 152, name: 'Utensílio Especial de Intimidação' },
        { id: 153, name: 'Utensílio Especial de Intuição' },
        { id: 154, name: 'Utensílio Especial de Percepção' },
        { id: 155, name: 'Utensílio Especial de Vontade' },
        { id: 156, name: 'Utensílio Especial de Fortitude' },
        { id: 157, name: 'Componente Simples de Conhecimento' },
        { id: 158, name: 'Componente Simples de Energia' },
        { id: 159, name: 'Componente Simples de Medo' },
        { id: 160, name: 'Componente Simples de Morte' },
        { id: 161, name: 'Componente Simples de Sangue' },
        { id: 162, name: 'Componente Complexo de Conhecimento' },
        { id: 163, name: 'Componente Complexo de Energia' },
        { id: 164, name: 'Componente Complexo de Medo' },
        { id: 165, name: 'Componente Complexo de Morte' },
        { id: 166, name: 'Componente Complexo de Sangue' },
        { id: 167, name: 'Componente Especial de Conhecimento' },
        { id: 168, name: 'Componente Especial de Energia' },
        { id: 169, name: 'Componente Especial de Medo' },
        { id: 170, name: 'Componente Especial de Morte' },
        { id: 171, name: 'Componente Especial de Sangue' },
    ];

    const handleRowClick = (id: number) => {
        setSelectedRowId(id);
    };

    const showSelectedId = () => {
        if (selectedRowId === null) return;

        const acaoFerramenta:number = 1;

        let item:Item;
        switch (selectedRowId) {
            case 1:
                item = new ItemEquipamento(new NomeItem('Vestimenta Simples de Acrobacia'), 3, 1, [], [new BuffExterno(6, 'Melhoria Simples por Equipamento', 2, acaoFerramenta, 5, 1, 1)], false, false, new DetalhesItemEquipamento());
                break;
            case 2:
                item = new ItemEquipamento(new NomeItem('Vestimenta Simples de Crime'), 3, 1, [], [new BuffExterno(12, 'Melhoria Simples por Equipamento', 2, acaoFerramenta, 5, 1, 1)], false, false, new DetalhesItemEquipamento());
                break;
            case 3:
                item = new ItemEquipamento(new NomeItem('Vestimenta Simples de Furtividade'), 3, 1, [], [new BuffExterno(17, 'Melhoria Simples por Equipamento', 2, acaoFerramenta, 5, 1, 1)], false, false, new DetalhesItemEquipamento());
                break;
            case 4:
                item = new ItemEquipamento(new NomeItem('Vestimenta Simples de Iniciativa'), 3, 1, [], [new BuffExterno(18, 'Melhoria Simples por Equipamento', 2, acaoFerramenta, 5, 1, 1)], false, false, new DetalhesItemEquipamento());
                break;
            case 5:
                item = new ItemEquipamento(new NomeItem('Vestimenta Simples de Pontaria'), 3, 1, [], [new BuffExterno(26, 'Melhoria Simples por Equipamento', 2, acaoFerramenta, 5, 1, 1)], false, false, new DetalhesItemEquipamento());
                break;
            case 6:
                item = new ItemEquipamento(new NomeItem('Vestimenta Simples de Reflexo'), 3, 1, [], [new BuffExterno(27, 'Melhoria Simples por Equipamento', 2, acaoFerramenta, 5, 1, 1)], false, false, new DetalhesItemEquipamento());
                break;
            case 7:
                item = new ItemEquipamento(new NomeItem('Vestimenta Simples de Atletismo'), 3, 1, [], [new BuffExterno(9, 'Melhoria Simples por Equipamento', 2, acaoFerramenta, 5, 1, 1)], false, false, new DetalhesItemEquipamento());
                break;
            case 8:
                item = new ItemEquipamento(new NomeItem('Vestimenta Simples de Luta'), 3, 1, [], [new BuffExterno(22, 'Melhoria Simples por Equipamento', 2, acaoFerramenta, 5, 1, 1)], false, false, new DetalhesItemEquipamento());
                break;
            case 9:
                item = new ItemEquipamento(new NomeItem('Vestimenta Simples de Adestramento'), 3, 1, [], [new BuffExterno(7, 'Melhoria Simples por Equipamento', 2, acaoFerramenta, 5, 1, 1)], false, false, new DetalhesItemEquipamento());
                break;
            case 10:
                item = new ItemEquipamento(new NomeItem('Vestimenta Simples de Artes'), 3, 1, [], [new BuffExterno(8, 'Melhoria Simples por Equipamento', 2, acaoFerramenta, 5, 1, 1)], false, false, new DetalhesItemEquipamento());
                break;
            case 11:
                item = new ItemEquipamento(new NomeItem('Vestimenta Simples de Atualidades'), 3, 1, [], [new BuffExterno(10, 'Melhoria Simples por Equipamento', 2, acaoFerramenta, 5, 1, 1)], false, false, new DetalhesItemEquipamento());
                break;
            case 12:
                item = new ItemEquipamento(new NomeItem('Vestimenta Simples de Ciências'), 3, 1, [], [new BuffExterno(11, 'Melhoria Simples por Equipamento', 2, acaoFerramenta, 5, 1, 1)], false, false, new DetalhesItemEquipamento());
                break;
            case 13:
                item = new ItemEquipamento(new NomeItem('Vestimenta Simples de Engenharia'), 3, 1, [], [new BuffExterno(15, 'Melhoria Simples por Equipamento', 2, acaoFerramenta, 5, 1, 1)], false, false, new DetalhesItemEquipamento());
                break;
            case 14:
                item = new ItemEquipamento(new NomeItem('Vestimenta Simples de Investigação'), 3, 1, [], [new BuffExterno(21, 'Melhoria Simples por Equipamento', 2, acaoFerramenta, 5, 1, 1)], false, false, new DetalhesItemEquipamento());
                break;
            case 15:
                item = new ItemEquipamento(new NomeItem('Vestimenta Simples de Medicina'), 3, 1, [], [new BuffExterno(23, 'Melhoria Simples por Equipamento', 2, acaoFerramenta, 5, 1, 1)], false, false, new DetalhesItemEquipamento());
                break;
            case 16:
                item = new ItemEquipamento(new NomeItem('Vestimenta Simples de Ocultista'), 3, 1, [], [new BuffExterno(24, 'Melhoria Simples por Equipamento', 2, acaoFerramenta, 5, 1, 1)], false, false, new DetalhesItemEquipamento());
                break;
            case 17:
                item = new ItemEquipamento(new NomeItem('Vestimenta Simples de Sobrevivência'), 3, 1, [], [new BuffExterno(28, 'Melhoria Simples por Equipamento', 2, acaoFerramenta, 5, 1, 1)], false, false, new DetalhesItemEquipamento());
                break;
            case 18:
                item = new ItemEquipamento(new NomeItem('Vestimenta Simples de Tatica'), 3, 1, [], [new BuffExterno(29, 'Melhoria Simples por Equipamento', 2, acaoFerramenta, 5, 1, 1)], false, false, new DetalhesItemEquipamento());
                break;
            case 19:
                item = new ItemEquipamento(new NomeItem('Vestimenta Simples de Tecnologia'), 3, 1, [], [new BuffExterno(30, 'Melhoria Simples por Equipamento', 2, acaoFerramenta, 5, 1, 1)], false, false, new DetalhesItemEquipamento());
                break;
            case 20:
                item = new ItemEquipamento(new NomeItem('Vestimenta Simples de Diplomacia'), 3, 1, [], [new BuffExterno(13, 'Melhoria Simples por Equipamento', 2, acaoFerramenta, 5, 1, 1)], false, false, new DetalhesItemEquipamento());
                break;
            case 21:
                item = new ItemEquipamento(new NomeItem('Vestimenta Simples de Enganação'), 3, 1, [], [new BuffExterno(14, 'Melhoria Simples por Equipamento', 2, acaoFerramenta, 5, 1, 1)], false, false, new DetalhesItemEquipamento());
                break;
            case 22:
                item = new ItemEquipamento(new NomeItem('Vestimenta Simples de Intimidação'), 3, 1, [], [new BuffExterno(19, 'Melhoria Simples por Equipamento', 2, acaoFerramenta, 5, 1, 1)], false, false, new DetalhesItemEquipamento());
                break;
            case 23:
                item = new ItemEquipamento(new NomeItem('Vestimenta Simples de Intuição'), 3, 1, [], [new BuffExterno(20, 'Melhoria Simples por Equipamento', 2, acaoFerramenta, 5, 1, 1)], false, false, new DetalhesItemEquipamento());
                break;
            case 24:
                item = new ItemEquipamento(new NomeItem('Vestimenta Simples de Percepção'), 3, 1, [], [new BuffExterno(25, 'Melhoria Simples por Equipamento', 2, acaoFerramenta, 5, 1, 1)], false, false, new DetalhesItemEquipamento());
                break;
            case 25:
                item = new ItemEquipamento(new NomeItem('Vestimenta Simples de Vontade'), 3, 1, [], [new BuffExterno(31, 'Melhoria Simples por Equipamento', 2, acaoFerramenta, 5, 1, 1)], false, false, new DetalhesItemEquipamento());
                break;
            case 26:
                item = new ItemEquipamento(new NomeItem('Vestimenta Simples de Fortitude'), 3, 1, [], [new BuffExterno(16, 'Melhoria Simples por Equipamento', 2, acaoFerramenta, 5, 1, 1)], false, false, new DetalhesItemEquipamento());
                break;
            case 27:
                item = new ItemEquipamento(new NomeItem('Utensílio Simples de Acrobacia'), 1, 1, [], [new BuffExterno(6, 'Melhoria Simples por Equipamento', 2, acaoFerramenta, 5, 1, 1)], true, false, new DetalhesItemEquipamento());
                break;
            case 28:
                item = new ItemEquipamento(new NomeItem('Utensílio Simples de Crime'), 1, 1, [], [new BuffExterno(12, 'Melhoria Simples por Equipamento', 2, acaoFerramenta, 5, 1, 1)], true, false, new DetalhesItemEquipamento());
                break;
            case 29:
                item = new ItemEquipamento(new NomeItem('Utensílio Simples de Furtividade'), 1, 1, [], [new BuffExterno(17, 'Melhoria Simples por Equipamento', 2, acaoFerramenta, 5, 1, 1)], true, false, new DetalhesItemEquipamento());
                break;
            case 30:
                item = new ItemEquipamento(new NomeItem('Utensílio Simples de Iniciativa'), 1, 1, [], [new BuffExterno(18, 'Melhoria Simples por Equipamento', 2, acaoFerramenta, 5, 1, 1)], true, false, new DetalhesItemEquipamento());
                break;
            case 31:
                item = new ItemEquipamento(new NomeItem('Utensílio Simples de Pontaria'), 1, 1, [], [new BuffExterno(26, 'Melhoria Simples por Equipamento', 2, acaoFerramenta, 5, 1, 1)], true, false, new DetalhesItemEquipamento());
                break;
            case 32:
                item = new ItemEquipamento(new NomeItem('Utensílio Simples de Reflexo'), 1, 1, [], [new BuffExterno(27, 'Melhoria Simples por Equipamento', 2, acaoFerramenta, 5, 1, 1)], true, false, new DetalhesItemEquipamento());
                break;
            case 33:
                item = new ItemEquipamento(new NomeItem('Utensílio Simples de Atletismo'), 1, 1, [], [new BuffExterno(9, 'Melhoria Simples por Equipamento', 2, acaoFerramenta, 5, 1, 1)], true, false, new DetalhesItemEquipamento());
                break;
            case 34:
                item = new ItemEquipamento(new NomeItem('Utensílio Simples de Luta'), 1, 1, [], [new BuffExterno(22, 'Melhoria Simples por Equipamento', 2, acaoFerramenta, 5, 1, 1)], true, false, new DetalhesItemEquipamento());
                break;
            case 35:
                item = new ItemEquipamento(new NomeItem('Utensílio Simples de Adestramento'), 1, 1, [], [new BuffExterno(7, 'Melhoria Simples por Equipamento', 2, acaoFerramenta, 5, 1, 1)], true, false, new DetalhesItemEquipamento());
                break;
            case 36:
                item = new ItemEquipamento(new NomeItem('Utensílio Simples de Artes'), 1, 1, [], [new BuffExterno(8, 'Melhoria Simples por Equipamento', 2, acaoFerramenta, 5, 1, 1)], true, false, new DetalhesItemEquipamento());
                break;
            case 37:
                item = new ItemEquipamento(new NomeItem('Utensílio Simples de Atualidades'), 1, 1, [], [new BuffExterno(10, 'Melhoria Simples por Equipamento', 2, acaoFerramenta, 5, 1, 1)], true, false, new DetalhesItemEquipamento());
                break;
            case 38:
                item = new ItemEquipamento(new NomeItem('Utensílio Simples de Ciências'), 1, 1, [], [new BuffExterno(11, 'Melhoria Simples por Equipamento', 2, acaoFerramenta, 5, 1, 1)], true, false, new DetalhesItemEquipamento());
                break;
            case 39:
                item = new ItemEquipamento(new NomeItem('Utensílio Simples de Engenharia'), 1, 1, [], [new BuffExterno(15, 'Melhoria Simples por Equipamento', 2, acaoFerramenta, 5, 1, 1)], true, false, new DetalhesItemEquipamento());
                break;
            case 40:
                item = new ItemEquipamento(new NomeItem('Utensílio Simples de Investigação'), 1, 1, [], [new BuffExterno(21, 'Melhoria Simples por Equipamento', 2, acaoFerramenta, 5, 1, 1)], true, false, new DetalhesItemEquipamento());
                break;
            case 41:
                item = new ItemEquipamento(new NomeItem('Utensílio Simples de Medicina'), 1, 1, [], [new BuffExterno(23, 'Melhoria Simples por Equipamento', 2, acaoFerramenta, 5, 1, 1)], true, false, new DetalhesItemEquipamento());
                break;
            case 42:
                item = new ItemEquipamento(new NomeItem('Utensílio Simples de Ocultista'), 1, 1, [], [new BuffExterno(24, 'Melhoria Simples por Equipamento', 2, acaoFerramenta, 5, 1, 1)], true, false, new DetalhesItemEquipamento());
                break;
            case 43:
                item = new ItemEquipamento(new NomeItem('Utensílio Simples de Sobrevivência'), 1, 1, [], [new BuffExterno(28, 'Melhoria Simples por Equipamento', 2, acaoFerramenta, 5, 1, 1)], true, false, new DetalhesItemEquipamento());
                break;
            case 44:
                item = new ItemEquipamento(new NomeItem('Utensílio Simples de Tatica'), 1, 1, [], [new BuffExterno(29, 'Melhoria Simples por Equipamento', 2, acaoFerramenta, 5, 1, 1)], true, false, new DetalhesItemEquipamento());
                break;
            case 45:
                item = new ItemEquipamento(new NomeItem('Utensílio Simples de Tecnologia'), 1, 1, [], [new BuffExterno(30, 'Melhoria Simples por Equipamento', 2, acaoFerramenta, 5, 1, 1)], true, false, new DetalhesItemEquipamento());
                break;
            case 46:
                item = new ItemEquipamento(new NomeItem('Utensílio Simples de Diplomacia'), 1, 1, [], [new BuffExterno(13, 'Melhoria Simples por Equipamento', 2, acaoFerramenta, 5, 1, 1)], true, false, new DetalhesItemEquipamento());
                break;
            case 47:
                item = new ItemEquipamento(new NomeItem('Utensílio Simples de Enganação'), 1, 1, [], [new BuffExterno(14, 'Melhoria Simples por Equipamento', 2, acaoFerramenta, 5, 1, 1)], true, false, new DetalhesItemEquipamento());
                break;
            case 48:
                item = new ItemEquipamento(new NomeItem('Utensílio Simples de Intimidação'), 1, 1, [], [new BuffExterno(19, 'Melhoria Simples por Equipamento', 2, acaoFerramenta, 5, 1, 1)], true, false, new DetalhesItemEquipamento());
                break;
            case 49:
                item = new ItemEquipamento(new NomeItem('Utensílio Simples de Intuição'), 1, 1, [], [new BuffExterno(20, 'Melhoria Simples por Equipamento', 2, acaoFerramenta, 5, 1, 1)], true, false, new DetalhesItemEquipamento());
                break;
            case 50:
                item = new ItemEquipamento(new NomeItem('Utensílio Simples de Percepção'), 1, 1, [], [new BuffExterno(25, 'Melhoria Simples por Equipamento', 2, acaoFerramenta, 5, 1, 1)], true, false, new DetalhesItemEquipamento());
                break;
            case 51:
                item = new ItemEquipamento(new NomeItem('Utensílio Simples de Vontade'), 1, 1, [], [new BuffExterno(31, 'Melhoria Simples por Equipamento', 2, acaoFerramenta, 5, 1, 1)], true, false, new DetalhesItemEquipamento());
                break;
            case 52:
                item = new ItemEquipamento(new NomeItem('Utensílio Simples de Fortitude'), 1, 1, [], [new BuffExterno(16, 'Melhoria Simples por Equipamento', 2, acaoFerramenta, 5, 1, 1)], true, false, new DetalhesItemEquipamento());
                break;
            case 53:
                item = new ItemEquipamento(new NomeItem('Vestimenta Complexa de Acrobacia'), 3, 2, [], [new BuffExterno(6, 'Melhoria Complexa por Equipamento', 5, acaoFerramenta, 5, 1, 1)], false, false, new DetalhesItemEquipamento());
                break;
            case 54:
                item = new ItemEquipamento(new NomeItem('Vestimenta Complexa de Crime'), 3, 2, [], [new BuffExterno(12, 'Melhoria Complexa por Equipamento', 5, acaoFerramenta, 5, 1, 1)], false, false, new DetalhesItemEquipamento());
                break;
            case 55:
                item = new ItemEquipamento(new NomeItem('Vestimenta Complexa de Furtividade'), 3, 2, [], [new BuffExterno(17, 'Melhoria Complexa por Equipamento', 5, acaoFerramenta, 5, 1, 1)], false, false, new DetalhesItemEquipamento());
                break;
            case 56:
                item = new ItemEquipamento(new NomeItem('Vestimenta Complexa de Iniciativa'), 3, 2, [], [new BuffExterno(18, 'Melhoria Complexa por Equipamento', 5, acaoFerramenta, 5, 1, 1)], false, false, new DetalhesItemEquipamento());
                break;
            case 57:
                item = new ItemEquipamento(new NomeItem('Vestimenta Complexa de Pontaria'), 3, 2, [], [new BuffExterno(26, 'Melhoria Complexa por Equipamento', 5, acaoFerramenta, 5, 1, 1)], false, false, new DetalhesItemEquipamento());
                break;
            case 58:
                item = new ItemEquipamento(new NomeItem('Vestimenta Complexa de Reflexo'), 3, 2, [], [new BuffExterno(27, 'Melhoria Complexa por Equipamento', 5, acaoFerramenta, 5, 1, 1)], false, false, new DetalhesItemEquipamento());
                break;
            case 59:
                item = new ItemEquipamento(new NomeItem('Vestimenta Complexa de Atletismo'), 3, 2, [], [new BuffExterno(9, 'Melhoria Complexa por Equipamento', 5, acaoFerramenta, 5, 1, 1)], false, false, new DetalhesItemEquipamento());
                break;
            case 60:
                item = new ItemEquipamento(new NomeItem('Vestimenta Complexa de Luta'), 3, 2, [], [new BuffExterno(22, 'Melhoria Complexa por Equipamento', 5, acaoFerramenta, 5, 1, 1)], false, false, new DetalhesItemEquipamento());
                break;
            case 61:
                item = new ItemEquipamento(new NomeItem('Vestimenta Complexa de Adestramento'), 3, 2, [], [new BuffExterno(7, 'Melhoria Complexa por Equipamento', 5, acaoFerramenta, 5, 1, 1)], false, false, new DetalhesItemEquipamento());
                break;
            case 62:
                item = new ItemEquipamento(new NomeItem('Vestimenta Complexa de Artes'), 3, 2, [], [new BuffExterno(8, 'Melhoria Complexa por Equipamento', 5, acaoFerramenta, 5, 1, 1)], false, false, new DetalhesItemEquipamento());
                break;
            case 63:
                item = new ItemEquipamento(new NomeItem('Vestimenta Complexa de Atualidades'), 3, 2, [], [new BuffExterno(10, 'Melhoria Complexa por Equipamento', 5, acaoFerramenta, 5, 1, 1)], false, false, new DetalhesItemEquipamento());
                break;
            case 64:
                item = new ItemEquipamento(new NomeItem('Vestimenta Complexa de Ciências'), 3, 2, [], [new BuffExterno(11, 'Melhoria Complexa por Equipamento', 5, acaoFerramenta, 5, 1, 1)], false, false, new DetalhesItemEquipamento());
                break;
            case 65:
                item = new ItemEquipamento(new NomeItem('Vestimenta Complexa de Engenharia'), 3, 2, [], [new BuffExterno(15, 'Melhoria Complexa por Equipamento', 5, acaoFerramenta, 5, 1, 1)], false, false, new DetalhesItemEquipamento());
                break;
            case 66:
                item = new ItemEquipamento(new NomeItem('Vestimenta Complexa de Investigação'), 3, 2, [], [new BuffExterno(21, 'Melhoria Complexa por Equipamento', 5, acaoFerramenta, 5, 1, 1)], false, false, new DetalhesItemEquipamento());
                break;
            case 67:
                item = new ItemEquipamento(new NomeItem('Vestimenta Complexa de Medicina'), 3, 2, [], [new BuffExterno(23, 'Melhoria Complexa por Equipamento', 5, acaoFerramenta, 5, 1, 1)], false, false, new DetalhesItemEquipamento());
                break;
            case 68:
                item = new ItemEquipamento(new NomeItem('Vestimenta Complexa de Ocultista'), 3, 2, [], [new BuffExterno(24, 'Melhoria Complexa por Equipamento', 5, acaoFerramenta, 5, 1, 1)], false, false, new DetalhesItemEquipamento());
                break;
            case 69:
                item = new ItemEquipamento(new NomeItem('Vestimenta Complexa de Sobrevivência'), 3, 2, [], [new BuffExterno(28, 'Melhoria Complexa por Equipamento', 5, acaoFerramenta, 5, 1, 1)], false, false, new DetalhesItemEquipamento());
                break;
            case 70:
                item = new ItemEquipamento(new NomeItem('Vestimenta Complexa de Tatica'), 3, 2, [], [new BuffExterno(29, 'Melhoria Complexa por Equipamento', 5, acaoFerramenta, 5, 1, 1)], false, false, new DetalhesItemEquipamento());
                break;
            case 71:
                item = new ItemEquipamento(new NomeItem('Vestimenta Complexa de Tecnologia'), 3, 2, [], [new BuffExterno(30, 'Melhoria Complexa por Equipamento', 5, acaoFerramenta, 5, 1, 1)], false, false, new DetalhesItemEquipamento());
                break;
            case 72:
                item = new ItemEquipamento(new NomeItem('Vestimenta Complexa de Diplomacia'), 3, 2, [], [new BuffExterno(13, 'Melhoria Complexa por Equipamento', 5, acaoFerramenta, 5, 1, 1)], false, false, new DetalhesItemEquipamento());
                break;
            case 73:
                item = new ItemEquipamento(new NomeItem('Vestimenta Complexa de Enganação'), 3, 2, [], [new BuffExterno(14, 'Melhoria Complexa por Equipamento', 5, acaoFerramenta, 5, 1, 1)], false, false, new DetalhesItemEquipamento());
                break;
            case 74:
                item = new ItemEquipamento(new NomeItem('Vestimenta Complexa de Intimidação'), 3, 2, [], [new BuffExterno(19, 'Melhoria Complexa por Equipamento', 5, acaoFerramenta, 5, 1, 1)], false, false, new DetalhesItemEquipamento());
                break;
            case 75:
                item = new ItemEquipamento(new NomeItem('Vestimenta Complexa de Intuição'), 3, 2, [], [new BuffExterno(20, 'Melhoria Complexa por Equipamento', 5, acaoFerramenta, 5, 1, 1)], false, false, new DetalhesItemEquipamento());
                break;
            case 76:
                item = new ItemEquipamento(new NomeItem('Vestimenta Complexa de Percepção'), 3, 2, [], [new BuffExterno(25, 'Melhoria Complexa por Equipamento', 5, acaoFerramenta, 5, 1, 1)], false, false, new DetalhesItemEquipamento());
                break;
            case 77:
                item = new ItemEquipamento(new NomeItem('Vestimenta Complexa de Vontade'), 3, 2, [], [new BuffExterno(31, 'Melhoria Complexa por Equipamento', 5, acaoFerramenta, 5, 1, 1)], false, false, new DetalhesItemEquipamento());
                break;
            case 78:
                item = new ItemEquipamento(new NomeItem('Vestimenta Complexa de Fortitude'), 3, 2, [], [new BuffExterno(16, 'Melhoria Complexa por Equipamento', 5, acaoFerramenta, 5, 1, 1)], false, false, new DetalhesItemEquipamento());
                break;
            case 79:
                item = new ItemEquipamento(new NomeItem('Utensílio Complexo de Acrobacia'), 1, 2, [], [new BuffExterno(6, 'Melhoria Complexa por Equipamento', 5, acaoFerramenta, 5, 1, 1)], true, false, new DetalhesItemEquipamento());
                break;
            case 80:
                item = new ItemEquipamento(new NomeItem('Utensílio Complexo de Crime'), 1, 2, [], [new BuffExterno(12, 'Melhoria Complexa por Equipamento', 5, acaoFerramenta, 5, 1, 1)], true, false, new DetalhesItemEquipamento());
                break;
            case 81:
                item = new ItemEquipamento(new NomeItem('Utensílio Complexo de Furtividade'), 1, 2, [], [new BuffExterno(17, 'Melhoria Complexa por Equipamento', 5, acaoFerramenta, 5, 1, 1)], true, false, new DetalhesItemEquipamento());
                break;
            case 82:
                item = new ItemEquipamento(new NomeItem('Utensílio Complexo de Iniciativa'), 1, 2, [], [new BuffExterno(18, 'Melhoria Complexa por Equipamento', 5, acaoFerramenta, 5, 1, 1)], true, false, new DetalhesItemEquipamento());
                break;
            case 83:
                item = new ItemEquipamento(new NomeItem('Utensílio Complexo de Pontaria'), 1, 2, [], [new BuffExterno(26, 'Melhoria Complexa por Equipamento', 5, acaoFerramenta, 5, 1, 1)], true, false, new DetalhesItemEquipamento());
                break;
            case 84:
                item = new ItemEquipamento(new NomeItem('Utensílio Complexo de Reflexo'), 1, 2, [], [new BuffExterno(27, 'Melhoria Complexa por Equipamento', 5, acaoFerramenta, 5, 1, 1)], true, false, new DetalhesItemEquipamento());
                break;
            case 85:
                item = new ItemEquipamento(new NomeItem('Utensílio Complexo de Atletismo'), 1, 2, [], [new BuffExterno(9, 'Melhoria Complexa por Equipamento', 5, acaoFerramenta, 5, 1, 1)], true, false, new DetalhesItemEquipamento());
                break;
            case 86:
                item = new ItemEquipamento(new NomeItem('Utensílio Complexo de Luta'), 1, 2, [], [new BuffExterno(22, 'Melhoria Complexa por Equipamento', 5, acaoFerramenta, 5, 1, 1)], true, false, new DetalhesItemEquipamento());
                break;
            case 87:
                item = new ItemEquipamento(new NomeItem('Utensílio Complexo de Adestramento'), 1, 2, [], [new BuffExterno(7, 'Melhoria Complexa por Equipamento', 5, acaoFerramenta, 5, 1, 1)], true, false, new DetalhesItemEquipamento());
                break;
            case 88:
                item = new ItemEquipamento(new NomeItem('Utensílio Complexo de Artes'), 1, 2, [], [new BuffExterno(8, 'Melhoria Complexa por Equipamento', 5, acaoFerramenta, 5, 1, 1)], true, false, new DetalhesItemEquipamento());
                break;
            case 89:
                item = new ItemEquipamento(new NomeItem('Utensílio Complexo de Atualidades'), 1, 2, [], [new BuffExterno(10, 'Melhoria Complexa por Equipamento', 5, acaoFerramenta, 5, 1, 1)], true, false, new DetalhesItemEquipamento());
                break;
            case 90:
                item = new ItemEquipamento(new NomeItem('Utensílio Complexo de Ciências'), 1, 2, [], [new BuffExterno(11, 'Melhoria Complexa por Equipamento', 5, acaoFerramenta, 5, 1, 1)], true, false, new DetalhesItemEquipamento());
                break;
            case 91:
                item = new ItemEquipamento(new NomeItem('Utensílio Complexo de Engenharia'), 1, 2, [], [new BuffExterno(15, 'Melhoria Complexa por Equipamento', 5, acaoFerramenta, 5, 1, 1)], true, false, new DetalhesItemEquipamento());
                break;
            case 92:
                item = new ItemEquipamento(new NomeItem('Utensílio Complexo de Investigação'), 1, 2, [], [new BuffExterno(21, 'Melhoria Complexa por Equipamento', 5, acaoFerramenta, 5, 1, 1)], true, false, new DetalhesItemEquipamento());
                break;
            case 93:
                item = new ItemEquipamento(new NomeItem('Utensílio Complexo de Medicina'), 1, 2, [], [new BuffExterno(23, 'Melhoria Complexa por Equipamento', 5, acaoFerramenta, 5, 1, 1)], true, false, new DetalhesItemEquipamento());
                break;
            case 94:
                item = new ItemEquipamento(new NomeItem('Utensílio Complexo de Ocultista'), 1, 2, [], [new BuffExterno(24, 'Melhoria Complexa por Equipamento', 5, acaoFerramenta, 5, 1, 1)], true, false, new DetalhesItemEquipamento());
                break;
            case 95:
                item = new ItemEquipamento(new NomeItem('Utensílio Complexo de Sobrevivência'), 1, 2, [], [new BuffExterno(28, 'Melhoria Complexa por Equipamento', 5, acaoFerramenta, 5, 1, 1)], true, false, new DetalhesItemEquipamento());
                break;
            case 96:
                item = new ItemEquipamento(new NomeItem('Utensílio Complexo de Tatica'), 1, 2, [], [new BuffExterno(29, 'Melhoria Complexa por Equipamento', 5, acaoFerramenta, 5, 1, 1)], true, false, new DetalhesItemEquipamento());
                break;
            case 97:
                item = new ItemEquipamento(new NomeItem('Utensílio Complexo de Tecnologia'), 1, 2, [], [new BuffExterno(30, 'Melhoria Complexa por Equipamento', 5, acaoFerramenta, 5, 1, 1)], true, false, new DetalhesItemEquipamento());
                break;
            case 98:
                item = new ItemEquipamento(new NomeItem('Utensílio Complexo de Diplomacia'), 1, 2, [], [new BuffExterno(13, 'Melhoria Complexa por Equipamento', 5, acaoFerramenta, 5, 1, 1)], true, false, new DetalhesItemEquipamento());
                break;
            case 99:
                item = new ItemEquipamento(new NomeItem('Utensílio Complexo de Enganação'), 1, 2, [], [new BuffExterno(14, 'Melhoria Complexa por Equipamento', 5, acaoFerramenta, 5, 1, 1)], true, false, new DetalhesItemEquipamento());
                break;
            case 100:
                item = new ItemEquipamento(new NomeItem('Utensílio Complexo de Intimidação'), 1, 2, [], [new BuffExterno(19, 'Melhoria Complexa por Equipamento', 5, acaoFerramenta, 5, 1, 1)], true, false, new DetalhesItemEquipamento());
                break;
            case 101:
                item = new ItemEquipamento(new NomeItem('Utensílio Complexo de Intuição'), 1, 2, [], [new BuffExterno(20, 'Melhoria Complexa por Equipamento', 5, acaoFerramenta, 5, 1, 1)], true, false, new DetalhesItemEquipamento());
                break;
            case 102:
                item = new ItemEquipamento(new NomeItem('Utensílio Complexo de Percepção'), 1, 2, [], [new BuffExterno(25, 'Melhoria Complexa por Equipamento', 5, acaoFerramenta, 5, 1, 1)], true, false, new DetalhesItemEquipamento());
                break;
            case 103:
                item = new ItemEquipamento(new NomeItem('Utensílio Complexo de Vontade'), 1, 2, [], [new BuffExterno(31, 'Melhoria Complexa por Equipamento', 5, acaoFerramenta, 5, 1, 1)], true, false, new DetalhesItemEquipamento());
                break;
            case 104:
                item = new ItemEquipamento(new NomeItem('Utensílio Complexo de Fortitude'), 1, 2, [], [new BuffExterno(16, 'Melhoria Complexa por Equipamento', 5, acaoFerramenta, 5, 1, 1)], true, false, new DetalhesItemEquipamento());
                break;
            case 105:
                item = new ItemEquipamento(new NomeItem('Vestimenta Especial de Acrobacia'), 3, 3, [], [new BuffExterno(6, 'Melhoria Especial por Equipamento', 8, acaoFerramenta, 5, 1, 1)], false, false, new DetalhesItemEquipamento());
                break;
            case 106:
                item = new ItemEquipamento(new NomeItem('Vestimenta Especial de Crime'), 3, 3, [], [new BuffExterno(12, 'Melhoria Especial por Equipamento', 8, acaoFerramenta, 5, 1, 1)], false, false, new DetalhesItemEquipamento());
                break;
            case 107:
                item = new ItemEquipamento(new NomeItem('Vestimenta Especial de Furtividade'), 3, 3, [], [new BuffExterno(17, 'Melhoria Especial por Equipamento', 8, acaoFerramenta, 5, 1, 1)], false, false, new DetalhesItemEquipamento());
                break;
            case 108:
                item = new ItemEquipamento(new NomeItem('Vestimenta Especial de Iniciativa'), 3, 3, [], [new BuffExterno(18, 'Melhoria Especial por Equipamento', 8, acaoFerramenta, 5, 1, 1)], false, false, new DetalhesItemEquipamento());
                break;
            case 109:
                item = new ItemEquipamento(new NomeItem('Vestimenta Especial de Pontaria'), 3, 3, [], [new BuffExterno(26, 'Melhoria Especial por Equipamento', 8, acaoFerramenta, 5, 1, 1)], false, false, new DetalhesItemEquipamento());
                break;
            case 110:
                item = new ItemEquipamento(new NomeItem('Vestimenta Especial de Reflexo'), 3, 3, [], [new BuffExterno(27, 'Melhoria Especial por Equipamento', 8, acaoFerramenta, 5, 1, 1)], false, false, new DetalhesItemEquipamento());
                break;
            case 111:
                item = new ItemEquipamento(new NomeItem('Vestimenta Especial de Atletismo'), 3, 3, [], [new BuffExterno(9, 'Melhoria Especial por Equipamento', 8, acaoFerramenta, 5, 1, 1)], false, false, new DetalhesItemEquipamento());
                break;
            case 112:
                item = new ItemEquipamento(new NomeItem('Vestimenta Especial de Luta'), 3, 3, [], [new BuffExterno(22, 'Melhoria Especial por Equipamento', 8, acaoFerramenta, 5, 1, 1)], false, false, new DetalhesItemEquipamento());
                break;
            case 113:
                item = new ItemEquipamento(new NomeItem('Vestimenta Especial de Adestramento'), 3, 3, [], [new BuffExterno(7, 'Melhoria Especial por Equipamento', 8, acaoFerramenta, 5, 1, 1)], false, false, new DetalhesItemEquipamento());
                break;
            case 114:
                item = new ItemEquipamento(new NomeItem('Vestimenta Especial de Artes'), 3, 3, [], [new BuffExterno(8, 'Melhoria Especial por Equipamento', 8, acaoFerramenta, 5, 1, 1)], false, false, new DetalhesItemEquipamento());
                break;
            case 115:
                item = new ItemEquipamento(new NomeItem('Vestimenta Especial de Atualidades'), 3, 3, [], [new BuffExterno(10, 'Melhoria Especial por Equipamento', 8, acaoFerramenta, 5, 1, 1)], false, false, new DetalhesItemEquipamento());
                break;
            case 116:
                item = new ItemEquipamento(new NomeItem('Vestimenta Especial de Ciências'), 3, 3, [], [new BuffExterno(11, 'Melhoria Especial por Equipamento', 8, acaoFerramenta, 5, 1, 1)], false, false, new DetalhesItemEquipamento());
                break;
            case 117:
                item = new ItemEquipamento(new NomeItem('Vestimenta Especial de Engenharia'), 3, 3, [], [new BuffExterno(15, 'Melhoria Especial por Equipamento', 8, acaoFerramenta, 5, 1, 1)], false, false, new DetalhesItemEquipamento());
                break;
            case 118:
                item = new ItemEquipamento(new NomeItem('Vestimenta Especial de Investigação'), 3, 3, [], [new BuffExterno(21, 'Melhoria Especial por Equipamento', 8, acaoFerramenta, 5, 1, 1)], false, false, new DetalhesItemEquipamento());
                break;
            case 119:
                item = new ItemEquipamento(new NomeItem('Vestimenta Especial de Medicina'), 3, 3, [], [new BuffExterno(23, 'Melhoria Especial por Equipamento', 8, acaoFerramenta, 5, 1, 1)], false, false, new DetalhesItemEquipamento());
                break;
            case 120:
                item = new ItemEquipamento(new NomeItem('Vestimenta Especial de Ocultista'), 3, 3, [], [new BuffExterno(24, 'Melhoria Especial por Equipamento', 8, acaoFerramenta, 5, 1, 1)], false, false, new DetalhesItemEquipamento());
                break;
            case 121:
                item = new ItemEquipamento(new NomeItem('Vestimenta Especial de Sobrevivência'), 3, 3, [], [new BuffExterno(28, 'Melhoria Especial por Equipamento', 8, acaoFerramenta, 5, 1, 1)], false, false, new DetalhesItemEquipamento());
                break;
            case 122:
                item = new ItemEquipamento(new NomeItem('Vestimenta Especial de Tatica'), 3, 3, [], [new BuffExterno(29, 'Melhoria Especial por Equipamento', 8, acaoFerramenta, 5, 1, 1)], false, false, new DetalhesItemEquipamento());
                break;
            case 123:
                item = new ItemEquipamento(new NomeItem('Vestimenta Especial de Tecnologia'), 3, 3, [], [new BuffExterno(30, 'Melhoria Especial por Equipamento', 8, acaoFerramenta, 5, 1, 1)], false, false, new DetalhesItemEquipamento());
                break;
            case 124:
                item = new ItemEquipamento(new NomeItem('Vestimenta Especial de Diplomacia'), 3, 3, [], [new BuffExterno(13, 'Melhoria Especial por Equipamento', 8, acaoFerramenta, 5, 1, 1)], false, false, new DetalhesItemEquipamento());
                break;
            case 125:
                item = new ItemEquipamento(new NomeItem('Vestimenta Especial de Enganação'), 3, 3, [], [new BuffExterno(14, 'Melhoria Especial por Equipamento', 8, acaoFerramenta, 5, 1, 1)], false, false, new DetalhesItemEquipamento());
                break;
            case 126:
                item = new ItemEquipamento(new NomeItem('Vestimenta Especial de Intimidação'), 3, 3, [], [new BuffExterno(19, 'Melhoria Especial por Equipamento', 8, acaoFerramenta, 5, 1, 1)], false, false, new DetalhesItemEquipamento());
                break;
            case 127:
                item = new ItemEquipamento(new NomeItem('Vestimenta Especial de Intuição'), 3, 3, [], [new BuffExterno(20, 'Melhoria Especial por Equipamento', 8, acaoFerramenta, 5, 1, 1)], false, false, new DetalhesItemEquipamento());
                break;
            case 128:
                item = new ItemEquipamento(new NomeItem('Vestimenta Especial de Percepção'), 3, 3, [], [new BuffExterno(25, 'Melhoria Especial por Equipamento', 8, acaoFerramenta, 5, 1, 1)], false, false, new DetalhesItemEquipamento());
                break;
            case 129:
                item = new ItemEquipamento(new NomeItem('Vestimenta Especial de Vontade'), 3, 3, [], [new BuffExterno(31, 'Melhoria Especial por Equipamento', 8, acaoFerramenta, 5, 1, 1)], false, false, new DetalhesItemEquipamento());
                break;
            case 130:
                item = new ItemEquipamento(new NomeItem('Vestimenta Especial de Fortitude'), 3, 3, [], [new BuffExterno(16, 'Melhoria Especial por Equipamento', 8, acaoFerramenta, 5, 1, 1)], false, false, new DetalhesItemEquipamento());
                break;
            case 131:
                item = new ItemEquipamento(new NomeItem('Utensílio Especial de Acrobacia'), 1, 3, [], [new BuffExterno(6, 'Melhoria Especial por Equipamento', 8, acaoFerramenta, 5, 1, 1)], true, false, new DetalhesItemEquipamento());
                break;
            case 132:
                item = new ItemEquipamento(new NomeItem('Utensílio Especial de Crime'), 1, 3, [], [new BuffExterno(12, 'Melhoria Especial por Equipamento', 8, acaoFerramenta, 5, 1, 1)], true, false, new DetalhesItemEquipamento());
                break;
            case 133:
                item = new ItemEquipamento(new NomeItem('Utensílio Especial de Furtividade'), 1, 3, [], [new BuffExterno(17, 'Melhoria Especial por Equipamento', 8, acaoFerramenta, 5, 1, 1)], true, false, new DetalhesItemEquipamento());
                break;
            case 134:
                item = new ItemEquipamento(new NomeItem('Utensílio Especial de Iniciativa'), 1, 3, [], [new BuffExterno(18, 'Melhoria Especial por Equipamento', 8, acaoFerramenta, 5, 1, 1)], true, false, new DetalhesItemEquipamento());
                break;
            case 135:
                item = new ItemEquipamento(new NomeItem('Utensílio Especial de Pontaria'), 1, 3, [], [new BuffExterno(26, 'Melhoria Especial por Equipamento', 8, acaoFerramenta, 5, 1, 1)], true, false, new DetalhesItemEquipamento());
                break;
            case 136:
                item = new ItemEquipamento(new NomeItem('Utensílio Especial de Reflexo'), 1, 3, [], [new BuffExterno(27, 'Melhoria Especial por Equipamento', 8, acaoFerramenta, 5, 1, 1)], true, false, new DetalhesItemEquipamento());
                break;
            case 137:
                item = new ItemEquipamento(new NomeItem('Utensílio Especial de Atletismo'), 1, 3, [], [new BuffExterno(9, 'Melhoria Especial por Equipamento', 8, acaoFerramenta, 5, 1, 1)], true, false, new DetalhesItemEquipamento());
                break;
            case 138:
                item = new ItemEquipamento(new NomeItem('Utensílio Especial de Luta'), 1, 3, [], [new BuffExterno(22, 'Melhoria Especial por Equipamento', 8, acaoFerramenta, 5, 1, 1)], true, false, new DetalhesItemEquipamento());
                break;
            case 139:
                item = new ItemEquipamento(new NomeItem('Utensílio Especial de Adestramento'), 1, 3, [], [new BuffExterno(7, 'Melhoria Especial por Equipamento', 8, acaoFerramenta, 5, 1, 1)], true, false, new DetalhesItemEquipamento());
                break;
            case 140:
                item = new ItemEquipamento(new NomeItem('Utensílio Especial de Artes'), 1, 3, [], [new BuffExterno(8, 'Melhoria Especial por Equipamento', 8, acaoFerramenta, 5, 1, 1)], true, false, new DetalhesItemEquipamento());
                break;
            case 141:
                item = new ItemEquipamento(new NomeItem('Utensílio Especial de Atualidades'), 1, 3, [], [new BuffExterno(10, 'Melhoria Especial por Equipamento', 8, acaoFerramenta, 5, 1, 1)], true, false, new DetalhesItemEquipamento());
                break;
            case 142:
                item = new ItemEquipamento(new NomeItem('Utensílio Especial de Ciências'), 1, 3, [], [new BuffExterno(11, 'Melhoria Especial por Equipamento', 8, acaoFerramenta, 5, 1, 1)], true, false, new DetalhesItemEquipamento());
                break;
            case 143:
                item = new ItemEquipamento(new NomeItem('Utensílio Especial de Engenharia'), 1, 3, [], [new BuffExterno(15, 'Melhoria Especial por Equipamento', 8, acaoFerramenta, 5, 1, 1)], true, false, new DetalhesItemEquipamento());
                break;
            case 144:
                item = new ItemEquipamento(new NomeItem('Utensílio Especial de Investigação'), 1, 3, [], [new BuffExterno(21, 'Melhoria Especial por Equipamento', 8, acaoFerramenta, 5, 1, 1)], true, false, new DetalhesItemEquipamento());
                break;
            case 145:
                item = new ItemEquipamento(new NomeItem('Utensílio Especial de Medicina'), 1, 3, [], [new BuffExterno(23, 'Melhoria Especial por Equipamento', 8, acaoFerramenta, 5, 1, 1)], true, false, new DetalhesItemEquipamento());
                break;
            case 146:
                item = new ItemEquipamento(new NomeItem('Utensílio Especial de Ocultista'), 1, 3, [], [new BuffExterno(24, 'Melhoria Especial por Equipamento', 8, acaoFerramenta, 5, 1, 1)], true, false, new DetalhesItemEquipamento());
                break;
            case 147:
                item = new ItemEquipamento(new NomeItem('Utensílio Especial de Sobrevivência'), 1, 3, [], [new BuffExterno(28, 'Melhoria Especial por Equipamento', 8, acaoFerramenta, 5, 1, 1)], true, false, new DetalhesItemEquipamento());
                break;
            case 148:
                item = new ItemEquipamento(new NomeItem('Utensílio Especial de Tatica'), 1, 3, [], [new BuffExterno(29, 'Melhoria Especial por Equipamento', 8, acaoFerramenta, 5, 1, 1)], true, false, new DetalhesItemEquipamento());
                break;
            case 149:
                item = new ItemEquipamento(new NomeItem('Utensílio Especial de Tecnologia'), 1, 3, [], [new BuffExterno(30, 'Melhoria Especial por Equipamento', 8, acaoFerramenta, 5, 1, 1)], true, false, new DetalhesItemEquipamento());
                break;
            case 150:
                item = new ItemEquipamento(new NomeItem('Utensílio Especial de Diplomacia'), 1, 3, [], [new BuffExterno(13, 'Melhoria Especial por Equipamento', 8, acaoFerramenta, 5, 1, 1)], true, false, new DetalhesItemEquipamento());
                break;
            case 151:
                item = new ItemEquipamento(new NomeItem('Utensílio Especial de Enganação'), 1, 3, [], [new BuffExterno(14, 'Melhoria Especial por Equipamento', 8, acaoFerramenta, 5, 1, 1)], true, false, new DetalhesItemEquipamento());
                break;
            case 152:
                item = new ItemEquipamento(new NomeItem('Utensílio Especial de Intimidação'), 1, 3, [], [new BuffExterno(19, 'Melhoria Especial por Equipamento', 8, acaoFerramenta, 5, 1, 1)], true, false, new DetalhesItemEquipamento());
                break;
            case 153:
                item = new ItemEquipamento(new NomeItem('Utensílio Especial de Intuição'), 1, 3, [], [new BuffExterno(20, 'Melhoria Especial por Equipamento', 8, acaoFerramenta, 5, 1, 1)], true, false, new DetalhesItemEquipamento());
                break;
            case 154:
                item = new ItemEquipamento(new NomeItem('Utensílio Especial de Percepção'), 1, 3, [], [new BuffExterno(25, 'Melhoria Especial por Equipamento', 8, acaoFerramenta, 5, 1, 1)], true, false, new DetalhesItemEquipamento());
                break;
            case 155:
                item = new ItemEquipamento(new NomeItem('Utensílio Especial de Vontade'), 1, 3, [], [new BuffExterno(31, 'Melhoria Especial por Equipamento', 8, acaoFerramenta, 5, 1, 1)], true, false, new DetalhesItemEquipamento());
                break;
            case 156:
                item = new ItemEquipamento(new NomeItem('Utensílio Especial de Fortitude'), 1, 3, [], [new BuffExterno(16, 'Melhoria Especial por Equipamento', 8, acaoFerramenta, 5, 1, 1)], true, false, new DetalhesItemEquipamento());
                break;
            case 157:
                item = new ItemComponente(new NomeItem('Componente Simples de Conhecimento'), 1, 0, new DetalhesItemComponente(1, 1, 2));
                break;
            case 158:
                item = new ItemComponente(new NomeItem('Componente Simples de Energia'), 1, 0, new DetalhesItemComponente(2, 1, 2));
                break;
            case 159:
                item = new ItemComponente(new NomeItem('Componente Simples de Medo'), 1, 0, new DetalhesItemComponente(3, 1, 2));
                break;
            case 160:
                item = new ItemComponente(new NomeItem('Componente Simples de Morte'), 1, 0, new DetalhesItemComponente(4, 1, 2));
                break;
            case 161:
                item = new ItemComponente(new NomeItem('Componente Simples de Sangue'), 1, 0, new DetalhesItemComponente(5, 1, 2));
                break;
            case 162:
                item = new ItemComponente(new NomeItem('Componente Complexo de Conhecimento'), 1, 0, new DetalhesItemComponente(1, 2, 1));
                break;
            case 163:
                item = new ItemComponente(new NomeItem('Componente Complexo de Energia'), 1, 0, new DetalhesItemComponente(2, 2, 1));
                break;
            case 164:
                item = new ItemComponente(new NomeItem('Componente Complexo de Medo'), 1, 0, new DetalhesItemComponente(3, 2, 1));
                break;
            case 165:
                item = new ItemComponente(new NomeItem('Componente Complexo de Morte'), 1, 0, new DetalhesItemComponente(4, 2, 1));
                break;
            case 166:
                item = new ItemComponente(new NomeItem('Componente Complexo de Sangue'), 1, 0, new DetalhesItemComponente(5, 2, 1));
                break;
            case 167:
                item = new ItemComponente(new NomeItem('Componente Especial de Conhecimento'), 1, 1, new DetalhesItemComponente(1, 3, 1));
                break;
            case 168:
                item = new ItemComponente(new NomeItem('Componente Especial de Energia'), 1, 1, new DetalhesItemComponente(2, 3, 1));
                break;
            case 169:
                item = new ItemComponente(new NomeItem('Componente Especial de Medo'), 1, 1, new DetalhesItemComponente(3, 3, 1));
                break;
            case 170:
                item = new ItemComponente(new NomeItem('Componente Especial de Morte'), 1, 1, new DetalhesItemComponente(4, 3, 1));
                break;
            case 171:
                item = new ItemComponente(new NomeItem('Componente Especial de Sangue'), 1, 1, new DetalhesItemComponente(5, 3, 1));
                break;
            default:
                item = new ItemEquipamento(new NomeItem('Vestimenta Simples de Acrobacia'), 3, 1, [], [new BuffExterno(6, 'Melhoria Simples por Equipamento', 2, acaoFerramenta, 5, 1, 1)], false, false, new DetalhesItemEquipamento());
                break;
        }

        FichaHelper.getInstance().personagem.inventario.adicionarItemNoInventario(item);
    };

    return (
        <div className={style.conteudo_shopping}>
            <h3>Componente de Tabela</h3>
            <table border={1} style={{ width: '100%', cursor: 'pointer' }}>
                <tbody>
                    {data.map((row) => (
                        <tr
                            key={row.id}
                            onClick={() => handleRowClick(row.id)}
                            style={{
                                backgroundColor: selectedRowId === row.id ? 'lightblue' : 'white',
                            }}
                        >
                            <td>{row.name}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <button onClick={showSelectedId} style={{ marginTop: '20px' }}>
                Adicionar no Inventário
            </button>
        </div>
    );
}

export default page;