import { Zombie } from "./models/zombie.js"
import { HighscoreManager } from "./models/highscoreManager.js";

class Game {
    constructor() {
        this.board = document.getElementById('game-board');
        this.rec_board = this.board.getBoundingClientRect();
        this.crosshair = document.getElementById('crosshair');
        this.scoreDisplay = document.getElementById('score-display');
        this.livesDisplay = [
            document.getElementById('life-1'),
            document.getElementById('life-2'),
            document.getElementById('life-3')
        ];
        this.nicknameDisplay = document.getElementById('nickname-display');
        this.gameOverScreen = document.getElementById('game-over-screen');
        this.finalScoreDisplay = document.getElementById('final-score');
        this.playAgainBtn = document.getElementById('play-again-btn');
        this.highscoreList = document.getElementById('highscore-list');

        this.nickname = '';
        this.score = 0;
        this.lives = 3;
        this.zombies = [];
        this.gameState = 'prompt';
        this.lastSpawn = 0;
        this.nextSpawnDelay = 3000;
        
        this.GAME_OVER_LIVES = 0;
        this.HIT_SCORE = 12;
        this.MISS_SCORE = -6;
        this.ZOMBIE_END_X = -300;

        const NPOINT_HASH = "96aaf3c2565c90c108d6";
        this.highscoreManager = new HighscoreManager(NPOINT_HASH);
        
        this.gameLoop = this.gameLoop.bind(this);
    }

    init() {
        document.addEventListener('mousemove', this.moveCrosshair.bind(this));
        this.board.addEventListener('click', this.handleBoardClick.bind(this));
        this.playAgainBtn.addEventListener('click', this.start.bind(this));
        
        this.promptNickname();
    }

    promptNickname() {
        let nick = null;

        while (!nick) {
            nick = prompt("Podaj swój nick do rankingu:", "Julian");

            if (nick === null) {
            } else if (nick.trim() === "") {
                alert("Nick nie może być pusty! Podaj swoją nazwę, aby zagrać.");
                nick = null;
            }
        }

        this.nickname = nick;
        this.nicknameDisplay.textContent = `Gracz: ${this.nickname}`;
        this.start();
    }

    start() {
        this.score = 0;
        this.lives = 3;
        this.zombies.forEach(zombie => zombie.remove());
        this.zombies = [];
        this.gameState = 'playing';

        this.gameOverScreen.classList.add('hidden');
        this.updateScore(0);
        this.updateLives();

        this.lastSpawn = performance.now();
        requestAnimationFrame(this.gameLoop);
    }

    gameLoop(timestamp) {
        if (this.gameState !== 'playing') return;

        const timeSinceSpawn = timestamp - this.lastSpawn;
        if (timeSinceSpawn > this.nextSpawnDelay) {
            this.spawnZombie();
            this.lastSpawn = timestamp;
            this.nextSpawnDelay = Math.random() * 2500;
        }

        for (let i = this.zombies.length - 1; i >= 0; i--) {
            const zombie = this.zombies[i];
            const status = zombie.update();

            if (status === 'escaped') {
                this.zombieEscaped(zombie, i);
            }
        }

        if (this.lives <= this.GAME_OVER_LIVES) {
            this.endGame();
        } else {
            requestAnimationFrame(this.gameLoop);
        }
    }

    spawnZombie() {
        const zombie = new Zombie(this.board, this.ZOMBIE_END_X);
        this.zombies.push(zombie);
    }

    handleBoardClick(event) {
        if (this.gameState !== 'playing') return;

        if (event.target.classList.contains('zombie')) {
            const zombie = event.target.zombieInstance;
            
            if (zombie.isDead) return;

            zombie.shoot();
            this.updateScore(this.HIT_SCORE);
            
            this.zombies = this.zombies.filter(z => z !== zombie);

        } else {
            this.updateScore(this.MISS_SCORE);
        }
    }

    zombieEscaped(zombie, index) {
        this.lives--;
        this.updateLives();
        zombie.remove();
        this.zombies.splice(index, 1);
    }

    updateScore(pointsToAdd) {
        this.score += pointsToAdd;
        if (this.score < 0) this.score = 0;
        
        this.scoreDisplay.textContent = this.score.toString().padStart(5, '0');
    }

    updateLives() {
        this.livesDisplay.forEach((lifeIcon, index) => {
            if (index < (3 - this.lives)) {
                lifeIcon.classList.remove('active');
            } else {
                lifeIcon.classList.add('active');
            }
        });
    }

    async endGame() {
        this.gameState = 'gameover';
        this.finalScoreDisplay.textContent = `Twój wynik: ${this.score}`;
        this.gameOverScreen.classList.remove('hidden');

        this.zombies.forEach(zombie => zombie.remove());
        this.zombies = [];

        this.highscoreList.innerHTML = "<li>Ładowanie rankingu...</li>";

        try {
            const topScores = await this.highscoreManager.processNewScore(this.nickname, this.score);
            this.highscoreManager.displayScores(topScores, this.highscoreList);
        } catch (error) {
            console.error("Błąd rankingu:", error);
            this.highscoreList.innerHTML = "<li>Nie udało się wczytać rankingu.</li>";
        }
    }

    moveCrosshair(event) {
        if (event.target.closest('#game-container')) {
            this.crosshair.style.display = 'block';
            this.crosshair.style.left = `${event.clientX - this.rec_board.left}px`;
            this.crosshair.style.top = `${event.clientY - this.rec_board.top}px`;
        } else {
            this.crosshair.style.display = 'none';
        }
    }
}

const game = new Game();
game.init();