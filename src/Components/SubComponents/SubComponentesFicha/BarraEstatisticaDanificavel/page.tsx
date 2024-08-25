import "./style.css";

const page: React.FC<{ pvAtual:number, pvMaximo:number, corBarra:string }> = ({ pvAtual, pvMaximo, corBarra }) => {
    const barWidth = (pvAtual / pvMaximo) * 100;

    return (
        <div className="health-bar">
            <div className="bar" style={{ width: `${barWidth}%`, background: `${corBarra}` }}></div>
            <div className="hit" style={{ width: `${0}%` }}></div>

            <div className="interno-barra">
                {pvAtual} / {pvMaximo}
            </div>
        </div>
    );
};

export default page;