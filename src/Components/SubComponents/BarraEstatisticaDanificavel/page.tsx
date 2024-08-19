import "./style.css";

interface ValoresBarra { hp:number, maxHp:number }

const page: React.FC<ValoresBarra> = ({ hp, maxHp }) => {
    const barWidth = (hp / maxHp) * 100;

    return (
        <div className="health-bar">
            <div className="bar" style={{ width: `${barWidth}%` }}></div>
            <div className="hit" style={{ width: `${0}%` }}></div>

            <div style={{ position: "absolute", top: "5px", left: 0, right: 0, textAlign: "center" }}>
                {hp} / {maxHp}
            </div>
        </div>
    );
};

export default page;