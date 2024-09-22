// #region Imports
import style from './style.module.css';
import { useSelector } from 'react-redux';
import { RootState } from 'Redux/store.ts';
import Tooltip from "Components/SubComponents/Tooltip/page.tsx";
// #endregion

const TooltipContainer: React.FC = () => {
  const tooltip = useSelector((state: RootState) => state.tooltipHelper);
  return (
    <div className={style.tooltip_container}>
      {tooltip.visible && (
        <Tooltip tooltip={tooltip}/>
      )}
    </div>
  );
};

export default TooltipContainer;