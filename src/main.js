import * as Phaser from 'https://cdn.jsdelivr.net/npm/phaser@3.80.1/dist/phaser.min.js';

const sizes = { width: 500, height: 500 }
const speedDown = 500

const gameCanvas = document.querySelector("#gameCanvas");
const gameStartDiv = document.querySelector("#gameStartDiv");
const gameStartBtn = document.querySelector("#gameStartBtn");
const gameEndDiv = document.querySelector("#gameEndDiv");
const gameWinLoseSpan = document.querySelector("#gameWinLoseSpan");
const gameEndScoreSpan = document.querySelector("#gameEndScoreSpan");
const gameRestartBtn = document.querySelector("#gameRestartBtn");

class GameScene extends Phaser.Scene {
  constructor() {
    super("scene-game");
    this.player;
    this.cursor;
    this.playerSpeed = speedDown + 50;
    this.target;
    this.points = 0;
    this.textScore;
    this.textTime;
    this.timedEvent;
    this.remainingTime;
  }

  preload() {
    this.load.image("bg", "./public/assets/bg.png");
    this.load.image("basket", "./public/assets/basket.png");
    this.load.image("apple", "./public/assets/apple.png");
  }

  create() {
    this.points = 0;
    this.remainingTime = 30;
    if (this.timedEvent) this.timedEvent.remove();
    this.add.image(0, 0, "bg").setOrigin(0, 0);

    this.player = this.physics.add.image(250, sizes.height - 100, "basket").setOrigin(0, 0);
    this.player.setImmovable(true);
    this.player.body.allowGravity = false;
    this.player.setCollideWorldBounds(true);
    this.player.setSize(this.player.width - this.player.width / 4, this.player.height / 6)
      .setOffset(this.player.width / 10, this.player.height - this.player.height / 5);

    this.target = this.physics.add.image(0, 0, "apple").setOrigin(0, 0);
    this.target.setX(this.getRandomX());
    this.target.setMaxVelocity(0, speedDown);

    this.physics.add.overlap(this.target, this.player, this.targetHit, null, this);

    this.cursor = this.input.keyboard.createCursorKeys();

    this.textScore = this.add.text(sizes.width - 120, 10, "Score : 0", {
      font: "25px Arial",
      fill: "#000000",
    });

    this.textTime = this.add.text(10, 10, "Temps Restant : 30", {
      font: "25px Arial",
      fill: "#000000",
    });

    this.timedEvent = this.time.delayedCall(30000, this.gameOver, [], this);
  }

  update() {
    this.remainingTime = this.timedEvent.getRemainingSeconds();
    this.textTime.setText(`Temps Restant : ${Math.round(this.remainingTime)}`);

    if (this.target.y >= sizes.height) {
      this.target.setY(0);
      this.target.setX(this.getRandomX());
    }

    const { left, right } = this.cursor;

    if (left.isDown) {
      this.player.setVelocityX(-this.playerSpeed);
    } else if (right.isDown) {
      this.player.setVelocityX(this.playerSpeed);
    } else {
      this.player.setVelocityX(0);
    }
  }

  getRandomX() {
    return Math.floor(Math.random() * 460);
  }

  targetHit() {
    this.target.setY(0);
    this.target.setX(this.getRandomX());
    this.points++;
    this.textScore.setText(`Score : ${this.points}`);
  }

  gameOver() {
  this.scene.pause();
  this.scene.stop();
  gameEndScoreSpan.textContent = this.points;
  gameWinLoseSpan.textContent = this.points >= 30 ? "Gagné !" : "Perdu !";
  gameEndDiv.style.display = "flex";
}
}

// ⚙️ Configuration du jeu sans scène au départ
const config = {
  type: Phaser.WEBGL,
  width: sizes.width,
  height: sizes.height,
  canvas: gameCanvas,
  physics: {
    default: "arcade",
    arcade: { gravity: { y: speedDown }, debug: true }
  },
  scene: [] 
};

const game = new Phaser.Game(config);


game.scene.add("scene-game", GameScene);


gameStartBtn.addEventListener("click", () => {
  gameStartDiv.style.display = "none";
  game.scene.start("scene-game");
});

gameRestartBtn.addEventListener("click", () => {
  gameEndDiv.style.display = "none";
  game.scene.start("scene-game");
});

