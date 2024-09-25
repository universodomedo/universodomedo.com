import React from "react";
import Select, { MultiValue, ActionMeta, SingleValue } from "react-select";
import style from "./style.module.css";

type OptionType = {
  value: string;
  label: string;
};

interface OptionsOutsideSelectProps {
  value: MultiValue<OptionType>;
  onChange?: (
    newValue: MultiValue<OptionType> | SingleValue<OptionType> | null,
    actionMeta: ActionMeta<OptionType>
  ) => void;
  options: OptionType[];
}

const OptionsOutsideSelect: React.FC<OptionsOutsideSelectProps> = (props) => {
  const { value, onChange } = props;

  const handleRemoveValue = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!onChange) return;
    const { id: idBotao } = e.currentTarget;

    const removedValue = value.find((val) => val.value === idBotao);
    if (!removedValue) return;

    onChange(
      value.filter((val) => val.value !== idBotao),
      { name: idBotao, action: "remove-value", removedValue }
    );
  };

  return (
    <div>
      <div className={style.container}>
        {value.map((val, index) => (
          <ValorSelecionado key={index} valorSelecionado={val} handleRemoveValue={handleRemoveValue} />
        ))}
      </div>
      <Select {...props} controlShouldRenderValue={false} isMulti options={props.options} />
    </div>
  );
};

const ValorSelecionado = ({ valorSelecionado, handleRemoveValue } : { valorSelecionado: {value: string; label: string}, handleRemoveValue: (e: React.MouseEvent<HTMLDivElement>) => void }) => {
  return (
    <div className={style.value_container}>
      <div className={style.value}>{valorSelecionado.label}</div>
      <BotaoFechar id={valorSelecionado.value} onClick={handleRemoveValue}/>
    </div>
  )
}

const BotaoFechar = ({ id, onClick }: { id: string; onClick: (e: React.MouseEvent<HTMLDivElement>) => void }) => {
  const svg = "M14.348 14.849c-0.469 0.469-1.229 0.469-1.697 0l-2.651-3.030-2.651 3.029c-0.469 0.469-1.229 0.469-1.697 0-0.469-0.469-0.469-1.229 0-1.697l2.758-3.15-2.759-3.152c-0.469-0.469-0.469-1.228 0-1.697s1.228-0.469 1.697 0l2.652 3.031 2.651-3.031c0.469-0.469 1.228-0.469 1.697 0s0.469 1.229 0 1.697l-2.758 3.152 2.758 3.15c0.469 0.469 0.469 1.229 0 1.698z";

  return (
    <div className={style.button_x} id={id} onClick={onClick} ><svg width={14} height={14} viewBox="0 0 20 20"><path d={svg}></path></svg></div>
  );
}

export default OptionsOutsideSelect;