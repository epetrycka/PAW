export class Zombie {
    constructor(board, endX) {
        this.board = board;
        this.endX = endX;
        this.isDead = false;

        const speedMultiplier = Math.random() * 4 + 1;
        this.speed = 50 + (speedMultiplier * 50);
        
        const scale = Math.random() * 0.4 + 0.8;
        
        const randomBottom = Math.random() * 150 + 50;

        this.element = document.createElement('div');
        this.element.classList.add('zombie');
        this.element.zombieInstance = this;

        this.element.style.transform = `scale(${scale})`;
        this.element.style.bottom = `${randomBottom}px`;
        
        const animationDuration = 1.2 - (speedMultiplier / 5) * 0.7;
        this.element.style.animationDuration = `${animationDuration}s`;
        
        this.board.appendChild(this.element);
        const boardWidth = this.board.offsetWidth;
        this.x = boardWidth * 1.1; // 110%
        this.element.style.left = `${this.x}px`;
        this.lastFrameTime = performance.now();
    }

    update() {
        if (this.isDead) return;

        const now = performance.now();
        const deltaTime = (now - this.lastFrameTime) / 1000;
        this.lastFrameTime = now;

        this.x -= this.speed * deltaTime;
        this.element.style.left = `${this.x}px`;

        if (this.x < this.endX) {
            return 'escaped';
        }
        return 'alive';
    }

    shoot() {
        this.isDead = true;
        this.element.classList.add('dead');
        setTimeout(() => {
            this.remove();
        }, 500);
    }

    remove() {
        if (this.element.parentElement) {
            this.board.removeChild(this.element);
        }
    }
}