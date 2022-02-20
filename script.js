const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width= window.innerWidth;
canvas.height= window.innerHeight;
let particleArray = [];
let adjustx = 2;
let adjusty = 10;

//handle mouse

const mouse = {
    x: null,
    y: null,
    radius: 100
}

window.addEventListener('mousemove', function(e){
    mouse.x = e.x;
    mouse.y = e.y;
    console.log(mouse.x, mouse.y)
})

ctx.fillStyle= 'white'
ctx.font = '30px Verdana';
ctx.fillText('Oi', 0, 40);
const textCoodinates = ctx.getImageData(0, 0, 100, 100)

class Particle {
    constructor(x, y){
        this.x = x;
        this.y = y
        this.size = 3;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = (Math.random() * 40) + 1;
    }
    draw(){
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.closePath();
        ctx.fill();
    }
    update(){
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;
        let maxDistance = mouse.radius;
        let force = (maxDistance - distance) / maxDistance;
        let directionX = forceDirectionX * force * this.density;
        let directionY = forceDirectionY * force * this.density;


        if(distance < 300){
            this.x  -= directionX;
            this.y  -= directionY;

        }else{
            if(this.x !== this.baseX){
                let dx = this.x - this.baseX;
                this.x -= dx/10;
            }
            if(this.y !== this.baseY){
                let dy = this.y - this.baseY;
                this.y -= dy/10;
            }
        }
    }
}

function init() {
    particleArray = [];
    for(let y = 0, y2 = textCoodinates.height; y < y2; y++){
        for(let x = 0 , x2 = textCoodinates.width; x < x2; x++){
            if(textCoodinates.data[(y * 4 * textCoodinates.width) + ( x * 4) + 3] > 128){
                let positionX = x + adjustx;
                let positionY = y + adjusty;
                particleArray.push(new Particle(positionX * 10, positionY * 10));
            }
        }
    }
}

init();

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    for(let i = 0; i < particleArray.length; i++){
        particleArray[i].draw();
        particleArray[i].update();

    }
    connect()
    requestAnimationFrame(animate)
}

animate();

function connect(){
    let opacityValue = 1;
    for(let a = 0; a< particleArray.length; a++){
        for(let b = a; b < particleArray.length; b++){
            let dx = particleArray[a].x - particleArray[b].x;
            let dy = particleArray[a].y - particleArray[b].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if(distance < 20){
                opacityValue = 1 - (distance/50)
                ctx.strokeStyle = 'rgba(255, 255, 255,' + opacityValue + ')';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(particleArray[a].x, particleArray[a].y);
                ctx.lineTo(particleArray[b].x, particleArray[b].y);
                ctx.stroke();
            }
        }
    }
}