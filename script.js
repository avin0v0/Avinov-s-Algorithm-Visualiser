const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const generateArrayBtn = document.getElementById('generateArray');
const algorithmSelect = document.getElementById('algorithmSelect');
const visualizeBtn = document.getElementById('visualize');
const speedRange = document.getElementById('speedRange');

let array = [];
const arraySize = 50;
const maxValue = 100;
let speed = 3;

function generateArray() {
    array = [];
    for (let i = 0; i < arraySize; i++) {
        array.push(Math.floor(Math.random() * maxValue) + 1);
    }
    drawArray();
}

function drawArray(highlightIndices = []) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const barWidth = canvas.width / arraySize;
    for (let i = 0; i < arraySize; i++) {
        const barHeight = (array[i] / maxValue) * canvas.height;
        if (highlightIndices.includes(i)) {
            ctx.fillStyle = '#e74c3c';
        } else {
            ctx.fillStyle = '#3498db';
        }
        ctx.fillRect(i * barWidth, canvas.height - barHeight, barWidth - 1, barHeight);
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function bubbleSort() {
    for (let i = 0; i < arraySize - 1; i++) {
        for (let j = 0; j < arraySize - i - 1; j++) {
            if (array[j] > array[j + 1]) {
                [array[j], array[j + 1]] = [array[j + 1], array[j]];
                drawArray([j, j + 1]);
                await sleep(500 / speed);
            }
        }
    }
}

async function quickSort(low = 0, high = arraySize - 1) {
    if (low < high) {
        let pi = await partition(low, high);
        await quickSort(low, pi - 1);
        await quickSort(pi + 1, high);
    }
}

async function partition(low, high) {
    let pivot = array[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
        if (array[j] < pivot) {
            i++;
            [array[i], array[j]] = [array[j], array[i]];
            drawArray([i, j, high]);
            await sleep(500 / speed);
        }
    }
    [array[i + 1], array[high]] = [array[high], array[i + 1]];
    drawArray([i + 1, high]);
    await sleep(500 / speed);
    return i + 1;
}

async function binarySearch(target) {
    array.sort((a, b) => a - b);
    drawArray();
    await sleep(1000 / speed);

    let left = 0;
    let right = arraySize - 1;

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        drawSearchArray(left, mid, right);
        await sleep(1000 / speed);

        if (array[mid] === target) return mid;
        if (array[mid] < target) left = mid + 1;
        else right = mid - 1;
    }

    return -1;
}

function drawSearchArray(left, mid, right) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const barWidth = canvas.width / arraySize;
    for (let i = 0; i < arraySize; i++) {
        const barHeight = (array[i] / maxValue) * canvas.height;
        if (i === mid) ctx.fillStyle = '#e74c3c';
        else if (i >= left && i <= right) ctx.fillStyle = '#2ecc71';
        else ctx.fillStyle = '#3498db';
        ctx.fillRect(i * barWidth, canvas.height - barHeight, barWidth - 1, barHeight);
    }
}

generateArrayBtn.addEventListener('click', generateArray);
visualizeBtn.addEventListener('click', async () => {
    const selectedAlgorithm = algorithmSelect.value;
    switch (selectedAlgorithm) {
        case 'bubbleSort':
            await bubbleSort();
            break;
        case 'quickSort':
            await quickSort();
            break;
        case 'binarySearch':
            const target = Math.floor(Math.random() * maxValue) + 1;
            await binarySearch(target);
            break;
    }
});

speedRange.addEventListener('input', (e) => {
    speed = parseInt(e.target.value);
});

// Set canvas size
function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    drawArray();
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();
generateArray();

