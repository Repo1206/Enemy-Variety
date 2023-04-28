document.addEventListener("DOMContentLoaded", function () {
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = 500;
  canvas.height = 800;

  const collisionCanvas = document.getElementById("collisionCanvas");
  const collisionCtx = collisionCanvas.getContext("2d");
  collisionCanvas.width = window.innerWidth;
  collisionCanvas.height = window.innerHeight;
  let highScore = localStorage.getItem("highScore")
    ? parseInt(localStorage.getItem("highScore"))
    : 0;

  let score = 0;
  let gameOver = false;

  let backgroundMusic = new Audio();
  backgroundMusic.src = "dark chamber piano.mp3";
  backgroundMusic.loop = true;
  backgroundMusic.volume = 1; // Adjust the volume (0 to 1)
  backgroundMusic.play();

  let backgroundImage = new Image();
  backgroundImage.src =
    "Repo__2d_dark_hunted_forest_asset_concept_art_inspired_by_tim_b_f9a0c67a-3c54-4c0e-bec3-4a79820953f6.png";
  ctx.font = "50px Impact";

  class Game {
    constructor(ctx, width, height) {
      this.ctx = ctx;
      this.width = width;
      this.height = height;
      this.enemies = [];
      this.enemyInterval = 500;
      this.enemyTimer = 0;
      this.enemyTypes = ["worm", "ghost", "spider", "raven"];
      this.randomColors = [
        Math.floor(Math.random() * 255),
        Math.floor(Math.random() * 255),
        Math.floor(Math.random() * 255),
      ];
      this.color =
        "rgb(" +
        this.randomColors[0] +
        "," +
        this.randomColors[1] +
        "," +
        this.randomColors[2] +
        ")";
      this.hasTrail = Math.random() > 0.5;
    }

    update(deltaTime) {
      this.enemies = this.enemies.filter((object) => !object.markedForDeletion);
      if (this.enemyTimer > this.enemyInterval) {
        this.#addNewEnemy();
        this.enemyTimer = 0;
        console.log(this.enemies);
      } else {
        this.enemyTimer += deltaTime;
      }
      // console.log("Updating...");
      this.enemies.forEach((object) => object.update(deltaTime));
      if (this.hasTrail) {
            for (let i = 0; i < 5; i++) {
              particles.push(
                new Particle(this.x, this.y, this.width, this.color)
              );
            }
          }
        }
    };

    draw() {
      // console.log("Drawing...");
      collisionCtx.fillStyle = this.color;
        collisionCtx.fillRect(this.x, this.y, this.width, this.height);
      this.enemies.forEach((object) => object.draw(this.ctx));
    };

    #addNewEnemy() {
      const randomEnemy =
        this.enemyTypes[Math.floor(Math.random() * this.enemyTypes.length)];
      if (randomEnemy == "worm") this.enemies.push(new Worm(this));
      else if (randomEnemy == "ghost") this.enemies.push(new Ghost(this));
      else if (randomEnemy == "spider") this.enemies.push(new Spider(this));
      else if (randomEnemy == "raven") this.enemies.push(new Raven(this));

      // this.enemies.sort(function (a, b) {
      //   return a.y - b.y;
      // });
    };
  }

  class Enemy {
    constructor(game) {
      this.game = game;
      // console.log(this.game);
      this.markedForDeletion = false;
      this.frameX = 0;
      this.maxFrame = 5;
      this.frameInterval = 100;
      this.frameTimer = 0;
    }
    update(deltaTime) {
      this.x -= this.vx * deltaTime;
      if (this.x < 0 - this.width) this.markedForDeletion = true;
      if (this.frameTimer > this.frameInterval) {
        if (this.frameX < this.maxFrame) this.frameX++;
        else this.frameX = 0;
        this.frameTimer = 0;
      } else {
        this.frameTimer += deltaTime;
      }
    }

    draw(ctx) {
      ctx.drawImage(
        this.image,
        this.frameX * this.spriteWidth,
        0,
        this.spriteWidth,
        this.spriteHeight,
        this.x,
        this.y,
        this.width,
        this.height
      );
    }
  }

  class Worm extends Enemy {
    constructor(game) {
      super(game);
      this.spriteWidth = 229;
      this.spriteHeight = 171;
      this.width = this.spriteWidth / 2;
      this.height = this.spriteHeight / 2;
      this.x = this.game.width;
      this.y = this.game.height - this.height;

      this.image = worm;
      this.vx = Math.random() * 0.1 + 0.1;
    }
  }
  class Ghost extends Enemy {
    constructor(game) {
      super(game);
      this.spriteWidth = 261;
      this.spriteHeight = 209;
      this.width = this.spriteWidth / 2;
      this.height = this.spriteHeight / 2;
      this.x = this.game.width;
      this.y = Math.random() * this.game.height * 0.6;
      this.image = ghost;
      this.vx = Math.random() * 0.2 + 0.1;
      this.angle = 0; //Math.sin Math.cos
      this.curve = Math.random() * 3;
    }
    update(deltaTime) {
      super.update(deltaTime);
      this.y += Math.sin(this.angle) * this.curve;
      this.angle += 0.04;
    }
    draw(ctx) {
      ctx.save();
      ctx.globalAlpha = 0.7;
      super.draw(ctx);
      ctx.restore();
    }
  }
  class Raven extends Enemy {
    constructor(game) {
      super(game);
      this.spriteWidth = 271;
      this.spriteHeight = 194;
      this.width = this.spriteWidth / 2;
      this.height = this.spriteHeight / 2;
      this.x = this.game.width;
      this.y = Math.random() * this.game.height * 0.6;
      this.image = raven;
      this.vx = Math.random() * 0.2 + 0.1;
      this.angle = 0; //Math.sin Math.cos
      this.curve = Math.random() * 3;
    }
    update(deltaTime) {
      super.update(deltaTime);
      this.y += Math.sin(this.angle) * this.curve;
      this.angle += 0.04;
    }
    draw(ctx) {
      super.draw(ctx);
    }
  }
  class Spider extends Enemy {
    constructor(game) {
      super(game);
      this.spriteWidth = 310;
      this.spriteHeight = 175;
      this.width = this.spriteWidth / 2;
      this.height = this.spriteHeight / 2;
      this.x = Math.random() * this.game.width;
      this.y = 0 - this.height;

      this.image = spider;
      this.vx = 0;
      this.vy = Math.random() * 0.1 + 0.1;
      this.maxLength = Math.random() * this.game.height;
    }
    update(deltaTime) {
      super.update(deltaTime);
      if (this.y < 0 - this.height * 2) this.markedForDeletion = true;
      this.y += this.vy * deltaTime;
      if (this.y > this.maxLength) this.vy *= -1;
    }
    draw(ctx) {
      ctx.beginPath();
      ctx.moveTo(this.x + this.width / 2, 0);
      ctx.lineTo(this.x + this.width / 2, this.y + 10);
      ctx.stroke();
      super.draw(ctx);
    }
  }

  let explosion = [];

    class Explosion {
      constructor(x, y, size) {
        this.image = new Image();
        this.image.src = "boom.png";
        this.spriteWidth = 200;
        this.spriteHeight = 179;
        this.size = size;
        this.x = x;
        this.y = y;
        this.frame = 0;
        this.sound = new Audio();
        this.sound.src = "Fire impact 1.wav";
        this.timeSinceLastFrame = 0;
        this.frameInterval = 200;
        this.markedForDeletion = false;
      }
      update(deltaTime) {
        if (this.frame === 0) this.sound.play();
        this.timeSinceLastFrame += deltaTime;
        if (this.timeSinceLastFrame > this.frameInterval) {
          this.frame++;
          this.timeSinceLastFrame = 0;
          if (this.frame > 5) this.markedForDeletion = true;
        }
      }
      draw() {
        ctx.drawImage(
          this.image,
          this.frame * this.spriteWidth,
          0,
          this.spriteWidth,
          this.spriteHeight,
          this.x,
          this.y - this.size / 4,
          this.size,
          this.size
        );
      }
    }

    let particles = [];
    class Particle {
      constructor(x, y, size, color) {
        this.size = size;
        this.x = x + this.size / 2 + Math.random() * 50 - 25;
        this.y = y + this.size / 3 + Math.random() * 50 - 25;
        this.radius = (Math.random() * this.size) / 10;
        this.maxRadius = Math.random() * 20 + 35;
        this.markedForDeletion = false;
        this.speedX = Math.random() * 1 + 0.5;
        this.color = color;
      }
      update() {
        this.x += this.speedX;
        this.radius += 0.3;
        if (this.radius > this.maxRadius - 5) this.markedForDeletion = true;
      }
      draw() {
        ctx.save();
        ctx.globalAlpha = 1 - this.radius / this.maxRadius;
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    function drawScore() {
      ctx.fillStyle = "black";
      ctx.fillText("Score:" + score, 50, 75);
      ctx.fillStyle = "white";

      ctx.fillText("Score:" + score, 55, 80);
    }

    function updateHighScore() {
      if (score > highScore) {
        highScore = score;
        localStorage.setItem("highScore", highScore);
      }
    }

    function drawHighScore() {
      ctx.fillStyle = "black";
      ctx.fillText("High Score:" + highScore, 50, 125);
      ctx.fillStyle = "white";
      ctx.fillText("High Score:" + highScore, 55, 130);
    }

    function drawGameOver() {
      ctx.textAlign = "center";
      ctx.fillStyle = "black";
      ctx.fillText(
        `GAME OVER, Your score is ${score}`,
        canvas.width / 2,
        canvas.height / 2
      );
      ctx.textAlign = "center";
      ctx.fillStyle = "white";
      ctx.fillText(
        `GAME OVER, Your score is ${score}`,
        canvas.width / 2,
        canvas.height / 2 + 5
      );
      ctx.fillStyle = "white";
      ctx.fillRect(canvas.width / 2 - 100, canvas.height / 2 + 50, 200, 50);
      ctx.fillStyle = "black";
      ctx.fillText("RESTART", canvas.width / 2, canvas.height / 2 + 85);
    }

    let musicStarted = false;

    window.addEventListener("click", function (e) {
      if (!musicStarted) {
        backgroundMusic.play();
        musicStarted = true;
      }
      const detectPixelColor = collisionCtx.getImageData(e.x, e.y, 1, 1);
      console.log(detectPixelColor);
      const pc = detectPixelColor.data;

      let ravenClicked = false; // Add a flag to check if a raven was clicked

      ravens.forEach((object) => {
        if (
          object.randomColors[0] === pc[0] &&
          object.randomColors[1] === pc[1] &&
          object.randomColors[2] === pc[2]
        ) {
          // Collision detection
          object.markedForDeletion = true;
          score++;
          explosion.push(new Explosion(object.x, object.y, object.width));
          console.log(explosion);
          ravenClicked = true; // Set the flag to true if a raven was clicked
        }
      });

      // If the click was not on a raven, set gameOver to true
      if (!ravenClicked) {
        gameOver = true;
      }
      if (!ravenClicked) {
        gameOver = true;
        updateHighScore(); // Update the high score when the game is over
      }
    });


  const game = new Game(ctx, canvas.width, canvas.height); // Create a new Game object
  let lastTime = 1;
  function animate(timeStamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    // console.log(deltaTime);

    game.update(deltaTime); // Call the Game object's update method
    game.draw(); // Call the Game object's draw method
    drawScore();
      drawHighScore();

      drawScore();
      [...particles, ...ravens, ...explosion].forEach((object) =>
        object.update(deltaTime)
      );
      [...particles, ...ravens, ...explosion].forEach((object) =>
        object.draw()
      );
      ravens = ravens.filter((object) => !object.markedForDeletion);
      explosion = explosion.filter((object) => !object.markedForDeletion);
      particles = particles.filter((object) => !object.markedForDeletion);
      if (!gameOver) requestAnimationFrame(animate);
      else drawGameOver();

    requestAnimationFrame(animate);
  }
  animate(0);
});
