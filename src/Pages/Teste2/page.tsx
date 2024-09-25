import Select, {MultiValue, SingleValue} from "react-select";
import OptionsOutsideSelect from "Pages/Teste2/OptionsOutsideSelect.tsx"

import { useState } from "react";

export default function App() {
    const [selected, setSelected] = useState<MultiValue<FormatOption>>([]);

    type FormatOption = { value: string, label: string };

    const opcoes: FormatOption[] = [
        { value: "chocolate", label: "Chocolate" },
        { value: "strawberry", label: "Strawberry" },
        { value: "vanilla", label: "Vanilla" },
    ];

    const opcoes2: FormatOption[] = [
        { value: "teste1", label: "teste1" },
        { value: "teste2", label: "teste2" },
        { value: "teste3", label: "teste3" },
    ];

    const handleSelectChange = (
        newValue: MultiValue<FormatOption> | SingleValue<FormatOption> | null
      ) => {
        // Verifique se newValue é null, então limpa a seleção
        if (newValue === null) {
          setSelected([]);
        }
        // Verifique se newValue é um array (MultiValue)
        else if (Array.isArray(newValue)) {
          setSelected(newValue);
        }
      };

    return (
        <div>
            <h2>Select 1</h2>
            <OptionsOutsideSelect
                onChange={handleSelectChange}
                options={opcoes}
                value={selected}
            />

            <h2>Select 2</h2>
            <OptionsOutsideSelect
                onChange={handleSelectChange}
                options={opcoes2}
                value={selected}
            />
        </div>
    );
}