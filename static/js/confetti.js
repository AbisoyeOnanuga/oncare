// Confetti piece size relative to the button size
const confettiSize = { width: 215.433, height: 51.2 };

function setConfettiColor(confettiPiece) {
    const color = `hsl(${Math.floor(Math.random() * 360)}, 100%, 50%)`;
    confettiPiece.style.setProperty('--confetti-color', color);
}

// Function to generate a random number within a range
function randomRange(min, max) {
    return Math.random() * (max - min) + min;
}

// Function to create a single confetti piece
function createConfettiPiece(x, y) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti-piece';
    confetti.style.left = x + 'px';
    confetti.style.top = y + 'px';

    // Randomize size and shape
    const size = randomRange(5, 10); // Size range between 5px and 10px
    confetti.style.width = size + 'px';
    confetti.style.height = size + 'px';
    confetti.style.backgroundColor = `hsl(${randomRange(0, 360)}, 100%, 50%)`; // Random color

    // Randomize shape
    const shapes = ['circle', 'square', 'star', 'spark'];
    const shapeType = shapes[Math.floor(randomRange(0, shapes.length))];
    // Apply additional styles if needed
    switch (shapeType) {
        case 'circle':
            confetti.style.borderRadius = '50%';
            break;
        case 'star':
            // Star shape is created with CSS, no inline styles needed here
            break;
        case 'spark':
            // Spark shape is created with CSS, no inline styles needed here
            break;
        // No default needed if no additional styles are required
    }
    
    // Set a random rainbow color
    setConfettiColor(confetti);

    return confetti;
}

// Function to animate confetti pieces
function animateConfetti() {
    const button = document.getElementById('analyse-note-btn');
    const rect = button.getBoundingClientRect();
    const confettiContainer = document.getElementById('confetti-container');

    // Clear previous confetti
    confettiContainer.innerHTML = '';

    for (let i = 0; i < 20; i++) { // Generate 50 pieces of confetti
        const confettiPiece = createConfettiPiece(rect.width / 2, rect.height / 2);
        confettiContainer.appendChild(confettiPiece);

        // Animate confetti piece
        confettiPiece.animate([
            { transform: `scale(1) translate(0, 0)`, opacity: 1 },
            { transform: `scale(1.5) translate(${randomRange(-rect.width / 3, rect.width / 3)}px, ${randomRange(-rect.height, rect.height)}px)`, opacity: 1 }
        ], {
            duration: randomRange(1000, 2000), // Duration between 1s and 3s
            easing: 'ease-out',
            fill: 'forwards'
        });

        // Remove confetti piece after animation
        setTimeout(() => confettiPiece.remove(), randomRange(1000, 1500));
    }
}

// Add event listener to the button
document.getElementById('analyse-note-btn').addEventListener('click', animateConfetti);

/*
function setConfettiColor(confettiPiece) {
    const rainbowColors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];
    const randomColor = rainbowColors[Math.floor(Math.random() * rainbowColors.length)];
    confettiPiece.style.setProperty('--color', randomColor);
}
*/
