const message = document.getElementById('message');


async function getAndLoseContext() {
    await new Promise((resolve) => {
        setTimeout(() => {
            const canvas = new OffscreenCanvas(2048, 2048);
            const gl = canvas.getContext('webgl2');
            if (!gl || gl.isContextLost()) {
                throw Error('getContext returned null or lost context');
            }

            // WebGL spec: "This is the recommended mechanism for applications to programmatically halt their use of the WebGL API."
            const loseContextExtension = gl.getExtension('WEBGL_lose_context');
            if (loseContextExtension) {
                loseContextExtension.loseContext();
            }

            resolve();
        });
    });
}

const startButton = document.getElementById('start');
startButton.addEventListener('click', async () => {
    startButton.disabled = true;
    const iterationsInput = document.getElementById('iterations');
    try {
        const numIterations = parseInt(iterationsInput.value);
        for (let i = 1; i <= numIterations; i++) {
            await getAndLoseContext();
            const percentDone = (i/numIterations) * 100;
            requestAnimationFrame(() => {
                message.innerText = `${percentDone.toFixed(0)}% completed`;
            });
        }
    } catch (e) {
        message.innerText = e;
    }
    message.innerText = 'Finished';
    startButton.disabled = false;
});
