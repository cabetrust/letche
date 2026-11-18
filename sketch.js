let particles = [];
const numParticles = 100;

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Ocultamos la flecha del cursor
  noCursor(); 
  
  // Inicializamos las partículas
  for (let i = 0; i < numParticles; i++) {
    particles.push(new Particle());
  }
}

function draw() {
  // El fondo debe ser oscuro para que el truco del contraste funcione mejor
  background(0);
  
  // Filtro de desenfoque para que las partículas se mezclen
  // Nota: blur() es pesado, si notas lentitud, reduce el número de partículas
  
  for (let p of particles) {
    p.applyPhysics();
    p.update();
    p.display();
  }

  // TRUCO DE LÍQUIDO: Aplicamos un filtro de umbral (threshold)
  // Esto hace que lo que está borroso se vuelva sólido, creando "puentes" entre gotas
  filter(THRESHOLD, 0.5); 
}

class Particle {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.vel = createVector(random(-2, 2), random(-2, 2));
    this.acc = createVector(0, 0);
    this.radius = 25; // Radio grande para que el desenfoque las una
    this.maxSpeed = 8;
  }

  applyPhysics() {
    // 1. Gravedad
    let gravity = createVector(0, 0.2);
    this.acc.add(gravity);

    // 2. Magnetismo hacia el cursor
    let mouse = createVector(mouseX, mouseY);
    let diff = p5.Vector.sub(mouse, this.pos);
    let distance = diff.mag();
    
    if (distance < 300) { // Radio de influencia del imán
      diff.setMag(0.8); // Fuerza de atracción
      this.acc.add(diff);
    }
    
    // Fricción suave para que parezca viscoso
    this.vel.mult(0.98);
  }

  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0); // Resetear aceleración cada frame

    // Rebotes en los bordes
    if (this.pos.x > width || this.pos.x < 0) this.vel.x *= -0.5;
    if (this.pos.y > height) {
      this.pos.y = height;
      this.vel.y *= -0.5;
    }
  }

  display() {
    noStroke();
    fill(255); // Color sólido (el filtro hará el resto)
    // Usamos drawingContext para aplicar un blur nativo de Canvas (más rápido que filter(BLUR))
    drawingContext.shadowBlur = 20;
    drawingContext.shadowColor = 'white';
    circle(this.pos.x, this.pos.y, this.radius * 2);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}