const imageUpload = document.getElementById('imageUpload');
const pixelSizeSlider = document.getElementById('pixelSize');
const pixelSizeValue = document.getElementById('pixelSizeValue');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const downloadBtn = document.getElementById('downloadBtn');

let originalImage = null;

imageUpload.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            originalImage = new Image();
            originalImage.onload = () => {
                pixelateImage();
            };
            originalImage.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

pixelSizeSlider.addEventListener('input', () => {
    pixelSizeValue.textContent = pixelSizeSlider.value;
    if (originalImage) {
        pixelateImage();
    }
});

function pixelateImage() {
    if (!originalImage) return;

    const pixelSize = parseInt(pixelSizeSlider.value);
    const imgWidth = originalImage.width;
    const imgHeight = originalImage.height;

    canvas.width = imgWidth;
    canvas.height = imgHeight;

    ctx.drawImage(originalImage, 0, 0, imgWidth, imgHeight);

    const imageData = ctx.getImageData(0, 0, imgWidth, imgHeight);
    const data = imageData.data;

    for (let y = 0; y < imgHeight; y += pixelSize) {
        for (let x = 0; x < imgWidth; x += pixelSize) {
            const red = data[((imgWidth * y) + x) * 4];
            const green = data[((imgWidth * y) + x) * 4 + 1];
            const blue = data[((imgWidth * y) + x) * 4 + 2];

            for (let nY = 0; nY < pixelSize; nY++) {
                for (let nX = 0; nX < pixelSize; nX++) {
                    if (x + nX < imgWidth && y + nY < imgHeight) {
                        data[((imgWidth * (y + nY)) + (x + nX)) * 4] = red;
                        data[((imgWidth * (y + nY)) + (x + nX)) * 4 + 1] = green;
                        data[((imgWidth * (y + nY)) + (x + nX)) * 4 + 2] = blue;
                    }
                }
            }
        }
    }
    ctx.putImageData(imageData, 0, 0);
}

downloadBtn.addEventListener('click', () => {
    if (!originalImage) {
        alert("Please upload an image first.");
        return;
    }
    const imageURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = imageURL;
    link.download = 'pixelated-image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}); 