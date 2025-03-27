

export async function initDraw(canvas: HTMLCanvasElement){

    const ctx = canvas.getContext('2d');

    if(!ctx){
        throw new Error('Canvas context not found');
    }

    const isDrawing = false;
    const startX = 0;
    const startY = 0;

    canvas.addEventListener('mousemove', (e) => {
        const width = e.clientX - startX;
        const height = e.clientY - startY;
    });

    canvas.addEventListener('mousedown', (e) => {
        
    });

    canvas.addEventListener('mouseup', (e) => {
        
    });

}