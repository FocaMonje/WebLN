//añadido para el efecto del fondo

const canvas = document.getElementById('particlesCanvas');
const ctx = canvas.getContext('2d');
const particlesArray = [];
let mouseX, mouseY;

// Ajustar el tamaño del canvas para cubrir toda la pantalla
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Clase para las partículas
class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 5 + 1;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
        this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.size *= 0.95; // Desaparece gradualmente
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

// Manejar el movimiento del ratón
canvas.addEventListener('mousemove', (event) => {
    mouseX = event.x;
    mouseY = event.y;
    // Crear varias partículas en la posición del ratón
    for (let i = 0; i < 5; i++) {
        particlesArray.push(new Particle(mouseX, mouseY));
    }
});

// Función para manejar las partículas
function handleParticles() {
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();

        // Eliminar partículas cuando su tamaño es demasiado pequeño
        if (particlesArray[i].size < 0.5) {
            particlesArray.splice(i, 1);
            i--;
        }
    }
}

// Animar las partículas
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    handleParticles();
    requestAnimationFrame(animate);
}

animate();