import { useCallback, useEffect, useRef, useState } from "react";
import Phaser from "phaser";
import PropTypes from "prop-types";

const Mammoths = ({ openPopup, closeWindow }) => {
  const gameRef = useRef(null);
  const [score, setScore] = useState(0);
  const hasStartedRef = useRef(false);
  const [hasStarted, setHasStarted] = useState(false);

  // Handles the game start logic, ensuring it starts only once
  const startGame = useCallback(() => {
    if (!hasStartedRef.current) {
      hasStartedRef.current = true;
      setHasStarted(true);
    }
  }, []);

  useEffect(() => {
    // Updates the score state when the player earns points
    const updateDetails = (_score) => {
      setScore(_score);
    };

    // Handles the end of the game and triggers the popup with the final score
    const handleEndGame = (_score) => {
      openPopup(
        "Game Is Over !",
        <p className="px-3 text-[17px]">
          Your score is <span className="font-bold">{_score}</span>. Would you
          like to save it on-chain, or replay to achieve a higher score?
        </p>,
        "Mammoths"
      );
      closeWindow();
    };

    // Handles the win scenario when the player completes the game
    const handleWinGame = (_score) => {
      openPopup(
        "Game Is Over !",
        <p className="px-3 text-[17px]">
          Congratulations! You beat the game. Your score is <span className="font-bold">{_score}</span>. Would you
          like to save it on-chain?
        </p>,
        "Mammoths"
      );
      closeWindow();
    };
    
    // Phaser Scene for the Mammoths game
    class MammothsScene extends Phaser.Scene {
      constructor() {
        super({ key: "MammothsScene" });
        this.gridSize = 32;
        this.score = 0;
        this.speed = 0.01;
        this.lastMoveTime = 0;
        this.directions = [];
        this.direction = Phaser.Math.Vector2.RIGHT;
        this.nextDirection = this.direction;
        this.directions.unshift(this.direction.clone());
        this.mammoth = null;
        this.food = null;
        this.mammoths = [];
        this.positions = [
          { x: 144, y: 144 },
          { x: 112, y: 144 },
          { x: 80, y: 144 },
        ];
      }
      
      // Preloads game assets such as images and audio
      preload() {
        this.load.image("board", "assets/games/mammoths/board/board.png");
        this.load.image("boundry", "assets/games/mammoths/board/boundry.png");
        this.load.spritesheet("mammothRight", "assets/games/mammoths/mammoth/mammoth_right.png", {
          frameWidth: 32,
          frameHeight: 32
        });
        this.load.spritesheet("mammothLeft", "assets/games/mammoths/mammoth/mammoth_left.png", {
          frameWidth: 32,
          frameHeight: 32
        });
        this.load.spritesheet("mammothUp", "assets/games/mammoths/mammoth/mammoth_up.png", {
          frameWidth: 32,
          frameHeight: 32
        });
        this.load.spritesheet("mammothDown", "assets/games/mammoths/mammoth/mammoth_down.png", {
          frameWidth: 32,
          frameHeight: 32
        });
        this.load.spritesheet("babyRight", "assets/games/mammoths/mammoth/baby_right.png", {
          frameWidth: 32,
          frameHeight: 32
        });
        this.load.spritesheet("babyLeft", "assets/games/mammoths/mammoth/baby_left.png", {
          frameWidth: 32,
          frameHeight: 32
        });
        this.load.spritesheet("babyUp", "assets/games/mammoths/mammoth/baby_up.png", {
          frameWidth: 32,
          frameHeight: 32
        });
        this.load.spritesheet("babyDown", "assets/games/mammoths/mammoth/baby_down.png", {
          frameWidth: 32,
          frameHeight: 32
        });
        this.load.spritesheet("iceCube", "assets/games/mammoths/icecube.png", {
          frameWidth: 32,
          frameHeight: 32
        });
        this.load.audio("eat", "assets/games/mammoths/audio/eat.mp3");
        this.load.audio("soundTrack", "assets/games/mammoths/audio/soundtrack.mp3");
        this.load.audio("move", "assets/games/mammoths/audio/move.wav");
      }

      // Creates the game scene, initializes game objects and animations
      create() {
        let bg = this.add.image(0, 0, "board");
        bg.displayWidth = this.sys.canvas.width;
        bg.displayHeight = this.sys.canvas.height;
        bg.setOrigin(0, 0);

        let border = this.add.image(0,0, "boundry");
        border.displayWidth = this.sys.canvas.width;
        border.displayHeight = this.sys.canvas.height;
        border.setOrigin(0, 0);

        const mammothTypes = [
          "mammothRight", "mammothLeft", "mammothUp", "mammothDown",
          "babyRight", "babyLeft", "babyUp", "babyDown"
        ];
      
        mammothTypes.forEach((type) => {
          this.anims.create({
            key: `${type}_walk`, // Özel animasyon adı (örn: "mammothRight_walk")
            frames: this.anims.generateFrameNumbers(type, { start: 0, end: 3 }),
            frameRate: 8,
            repeat: -1,
          });
        });
        
        this.anims.create({
          key: `shake`,
          frames: this.anims.generateFrameNumbers("iceCube", { start: 0, end: 3 }),
          frameRate: 8,
          repeat: -1,
        });
  
        this.mammoths.push(this.physics.add.sprite(144, 144, "mammothRight"));
        this.mammoth = this.mammoths[0];
        this.mammoth.setCollideWorldBounds(true);
        this.mammoth.body.onWorldBounds = true;
        this.mammoth.body.world.on("worldbounds", this.endGame, this);
        this.physics.world.enable(this.mammoth);

        this.food = this.physics.add.sprite(240, 144, "iceCube");
        this.physics.world.enable(this.food);
        this.food.anims.play("shake");

        this.mammoths.push(this.physics.add.sprite(112, 144, "babyRight"));
        this.mammoths.push(this.physics.add.sprite(80, 144, "babyRight"));

        for (let i = 0; i < this.mammoths.length; i++) {
          this.positions[i].x = this.mammoths[i].x;
          this.positions[i].y = this.mammoths[i].y;
        }

        this.soundTrack = this.sound.add("soundTrack", { loop: true });
        this.soundTrack.play();
        this.soundTrack.setVolume(0.05);

        this.moveSoundEffect = this.sound.add("move");
        this.moveSoundEffect.setVolume(1);

        this.eatSoundEffect = this.sound.add("eat");
        this.eatSoundEffect.setVolume(0.5);

        this.spawnFood();

        this.input.keyboard.on("keydown", (event) => {
          if (
            event.key === "ArrowLeft" && !this.direction.equals(Phaser.Math.Vector2.RIGHT)
          ) {
            this.nextDirection = Phaser.Math.Vector2.LEFT.clone();
          }
          if (
            event.key === "ArrowRight" && !this.direction.equals(Phaser.Math.Vector2.LEFT)
          ) {
            this.nextDirection = Phaser.Math.Vector2.RIGHT.clone();
          }
          if (
            event.key === "ArrowUp" && !this.direction.equals(Phaser.Math.Vector2.DOWN)
          ) {
            this.nextDirection = Phaser.Math.Vector2.UP.clone();
          }
          if (
            event.key === "ArrowDown" && !this.direction.equals(Phaser.Math.Vector2.UP)
          ) {
            this.nextDirection = Phaser.Math.Vector2.DOWN.clone();
          }
        });
      }
      
      // Handles game update logic, movement, and collision detection
      update(time) {
        if (this.isMoving || !hasStartedRef.current) return;

        if (this.mammoths.length >= 224) {
          this.winGame();
        }

        if (time >= this.lastMoveTime) {
          this.isMoving = true;

          if (this.nextDirection) {
            this.direction = this.nextDirection;
            this.nextDirection = null;
            let randomDetune = Phaser.Math.Between(300, 800);
            this.moveSoundEffect.setDetune(randomDetune);
            this.moveSoundEffect.play();
          }

          this.directions.unshift(this.direction.clone());
          if (this.directions.length > this.mammoths.length) {
            this.directions.pop();
          }

          let targetX = this.mammoths[0].x + this.direction.x * this.gridSize;
          let targetY = this.mammoths[0].y + this.direction.y * this.gridSize;

          let oldPositions = [];

          for (let i = 0; i < this.mammoths.length; i++) {
            oldPositions.push({ x: this.mammoths[i].x, y: this.mammoths[i].y });
          }

          let completedTweens = 0;
          let ateFood = false;

          for (let i = 0; i < this.mammoths.length; i++) {
            let target =
              i === 0
                ? { x: targetX, y: targetY }
                : { x: oldPositions[i - 1].x, y: oldPositions[i - 1].y };

            this.tweens.add({
              targets: this.mammoths[i],
              x: target.x,
              y: target.y,
              duration: 160,
              ease: "Linear",
              onStart: () => {
                this.setHeadTexture();
                for (let j = 1; j < this.mammoths.length; j++) {
                  this.setBodyTexture(j, this.directions[j]);
                }
                let textureKey = this.mammoths[i].texture.key;
                this.mammoths[i].anims.play(`${textureKey}_walk`, true);
              },
              onComplete: () => {
                completedTweens++;
                if (completedTweens === this.mammoths.length) {
                  this.isMoving = false;

                  if (ateFood) {
                    this.addNewMammothPart(
                      oldPositions[oldPositions.length - 1]
                    );
                  }
                }
              },
            });
          }

          if (this.physics.overlap(this.mammoth, this.food)) {
            ateFood = true;
            this.score ++;
            let randomDetune = Phaser.Math.Between(400, 700);
            this.eatSoundEffect.setDetune(randomDetune);
            this.eatSoundEffect.play();
            updateDetails(this.score);
            this.spawnFood();
          }

          this.lastMoveTime = time + 150;
        }
      }

      // Adds a new mammoth segment when food is consumed
      addNewMammothPart(lastTailPosition) {
        let currDirection = this.directions[this.directions.length - 1]
        let babyType = "";
        if (currDirection.y !== 0) {
          if (currDirection.x == 1) {
            babyType = "babyLeft";
          } else {
            babyType = "babyRight";
          }
        }else {
          if (currDirection.y == 1) {
            babyType = "babyDown";
          } else {
            babyType = "babyUp";
          }
        }

        let newPart = this.physics.add.sprite(lastTailPosition.x, lastTailPosition.y, babyType)
        this.physics.world.addCollider(this.mammoth, newPart, this.endGame.bind(this));
        this.mammoths.push(newPart);
      }

      // Updates the head texture based on movement direction
      setHeadTexture() {
        let headTextureMap = {
          "0,-1": "mammothUp",
          "0,1": "mammothDown",
          "-1,0": "mammothLeft",
          "1,0": "mammothRight",
        };

        let directionKey = `${this.direction.x},${this.direction.y}`;
        this.mammoth.setTexture(headTextureMap[directionKey]);
        this.mammoth.body.updateBounds();
        this.mammoth.body.reset(this.mammoth.x, this.mammoth.y);
      }

      // Updates the body textures based on movement direction
      setBodyTexture(i, oldDirection) {
        if (i === 0 || i >= this.directions.length) return;

        let currDirection = oldDirection;
    
        if (currDirection.y !== 0) {
          if (currDirection.y !== -1) {
            this.mammoths[i].setTexture("babyDown");
            this.mammoths[i].body.updateBounds();
            this.mammoths[i].body.reset(this.mammoths[i].x, this.mammoths[i].y);
          } else {
            this.mammoths[i].setTexture("babyUp");
            this.mammoths[i].body.updateBounds();
            this.mammoths[i].body.reset(this.mammoths[i].x, this.mammoths[i].y);
          }
        } else {
          if (currDirection.x !== -1) {
            this.mammoths[i].setTexture("babyRight");
            this.mammoths[i].body.updateBounds();
            this.mammoths[i].body.reset(this.mammoths[i].x, this.mammoths[i].y);
          } else {
            this.mammoths[i].setTexture("babyLeft");
            this.mammoths[i].body.updateBounds();
            this.mammoths[i].body.reset(this.mammoths[i].x, this.mammoths[i].y);
          }
        }
      }

      // Spawns food at a random position ensuring it does not collide with the snake
      spawnFood() {
        let maxX = this.sys.game.config.width / this.gridSize;
        let maxY = this.sys.game.config.height / this.gridSize;

        do {
          let randomX = Phaser.Math.Between(0, maxX - 1) * this.gridSize;
          let randomY = Phaser.Math.Between(0, maxY - 1) * this.gridSize;

          var target = {x: randomX + this.gridSize / 2, y: randomY + this.gridSize / 2}
        }while (this.mammoths.some(m => m.x === target.x && m.y === target.y))

        this.food.setPosition(target.x, target.y);
      }

      // Triggers win condition when maximum length is reached
      winGame() {
        handleWinGame(this.score);
      }

      // Ends the game if the player collides with itself or boundaries
      endGame() {
        handleEndGame(this.score);
      }
    }

    // Phaser game configuration
    const config = {
      type: Phaser.AUTO,
      width: 480,
      height: 480,
      scene: MammothsScene,
      physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 0 },
          debug: false,
        },
      },
      parent: gameRef.current,
    };

    const game = new Phaser.Game(config);

    return () => {
      game.destroy(true);
    };
  }, [openPopup, closeWindow, startGame]);

  return (
    <div
      className="flex w-full h-full relative"
      style={{ backgroundImage: "url('assets/games/mammoths/mammoths.png')" }}
    >
      <div
        ref={gameRef}
        className={`w-[480px] h-[480px] z-10 ml-[24px] mt-[10px]`}
      />
      {!hasStarted && (
        <div
          onClick={startGame}
          className="cursor-pointer absolute flex w-full h-full z-10"
        >
          <div className="bg-black absolute w-full h-full opacity-90"></div>
          <img
            src="assets/p2s.gif"
            className="z-10 w-[350px] h-[200px] mx-auto mb-12 mt-auto"
            alt=""
          />
        </div>
      )}
      <div className="w-[60px] ml-[45px] mt-[75px] text-[18px] text-white flex flex-col gap-4">
        <p className="w-[40px] text-[30px] text-center font-bold">{score}</p>
      </div>
    </div>
  );
};

Mammoths.propTypes = {
  openPopup: PropTypes.func.isRequired,
  closeWindow: PropTypes.func.isRequired,
};

export default Mammoths;
