const message = document.getElementById('message');

async function run(numIterations, useOffscreenCanvas) {

    for (let i = 1; i <= numIterations; i++) {
        const canvas = useOffscreenCanvas ?
            new OffscreenCanvas(2048, 2048) : document.createElement('canvas');
        if (canvas instanceof HTMLCanvasElement) {
            canvas.width = 2048;
            canvas.height = 2048;
        }

        const gl = canvas.getContext('webgl2');
        if (!gl) {
            throw Error('getContext returned null');
        }
        if (gl.isContextLost()) {
            throw Error('getContext returned lost context');
        }

        const loseContextExtension = gl.getExtension('WEBGL_lose_context');
        if (loseContextExtension) {
            // see: https://registry.khronos.org/webgl/extensions/WEBGL_lose_context/
            // Implementations should destroy the underlying graphics context and all graphics resources when this
            // method is called. This is the recommended mechanism for applications to programmatically halt their
            // use of the WebGL API.
            loseContextExtension.loseContext();
            console.log(`Called loseContext() in iteration ${i}`);
        }

    }
}

const startButton = document.getElementById('start');
startButton.addEventListener('click', async () => {
    startButton.disabled = true;

    message.innerText = 'Running...';
    const offscreenCanvasCheckbox = document.getElementById('offscreen-canvas');
    const iterationsInput = document.getElementById('iterations');
    try {
        await run(parseInt(iterationsInput.value), offscreenCanvasCheckbox.checked);
    } catch (e) {
        message.innerText = e;
    }
    message.innerText = 'Finished';
    startButton.disabled = false;
});
