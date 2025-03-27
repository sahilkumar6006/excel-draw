

export async function initDraw(canvas: HTMLCanvasElement){

    const ctx = canvas.getContext('2d');

    if(!ctx){
        throw new Error('Canvas context not found');
    }

    let isDrawing = false;
    let startX = 0;
    let startY = 0;

    canvas.addEventListener('mousedown', (e: MouseEvent) => {
        isDrawing = true;
        startX = e.clientX;
        startY = e.clientY;
    });

    canvas.addEventListener('mousemove', (e: MouseEvent) => {
        console.log(e);
        if (!isDrawing) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const width = e.clientX - startX;
        const height = e.clientY - startY;
        ctx.strokeRect(startX, startY, width, height);
    });
    
    canvas.addEventListener('mouseup', () => {
        isDrawing = false;
        ctx.fillRect(startX, startY, e.clientX - startX, e.clientY - startY);
    });


}