import React, { useRef, useState, useEffect } from 'react';

interface DrawingToolProps {
}

const page: React.FC<DrawingToolProps> = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [drawing, setDrawing] = useState(false);
    const [paths, setPaths] = useState<string[]>([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const context = canvas.getContext('2d');
            if (context) {
                context.fillStyle = 'black';
                context.fillRect(0, 0, 100, 100);
                context.strokeStyle = 'white';
                context.lineWidth = 5;
                context.lineCap = 'round';
            }
        }
    }, []);

    const startDrawing = () => setDrawing(true);
    const endDrawing = () => setDrawing(false);

    const draw = (event: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas || !drawing) return;

        const context = canvas.getContext('2d');
        if (context) {
            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            context.lineTo(x, y);
            context.stroke();
            context.beginPath();
            context.moveTo(x, y);

            const newPath = `M${x},${y}`;
            setPaths((prevPaths) => [...prevPaths, newPath]);
        }
    };

    const exportPathData = () => {
        const pathData = paths.join(' ');
        console.log("AQUI <<<<<<<<<<<<<<");
        console.log(pathData);
    };

    return (
        <div>
            <canvas
                ref={canvasRef}
                width={100}
                height={100}
                onMouseDown={startDrawing}
                onMouseUp={endDrawing}
                onMouseMove={draw}
                onMouseLeave={endDrawing}
                style={{ border: '1px solid white', cursor: 'crosshair' }}
            />
            <button onClick={exportPathData}>Finish and Save</button>
        </div>
    );
};

export default page;