export default function InputNumerico({ value, onChange, min, max, step }: { value: number; onChange: (value: number) => void; min?: number; max?: number; step?: number; }) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.valueAsNumber;
        if (!isNaN(newValue)) {
            onChange(newValue);
        }
    };

    return (
        <input type="number" value={value} onChange={handleChange} min={min} max={max} step={step} />
    );
};