import { useCallback, useEffect, useRef, useState } from "react";
import Phaser from "phaser";
import PropTypes from "prop-types";

const Mockey = ({ openPopup, closeWindow }) => {
  const gameRef = useRef(null);
  const [playerScore, setPlayerScore] = useState(0);
  const [keeperScore, setKeeperScore] = useState(0);
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
    // Updates the score details for both the player and the AI keeper
    const updateDetails = (_player, _keeper) => {
      setPlayerScore(_player);
      setKeeperScore(_keeper);
    };

    // Handles the end game scenario and triggers the final score popup
    const handleEndGame = (_score) => {
      openPopup(
        "Game Is Over !",
        <p className="px-3 text-[17px]">
          Your score is <span className="font-bold">{_score}</span>. Would you
          like to save it on-chain, or replay to achieve a higher score?
        </p>,
        "Mockey"
      );
      closeWindow();
    };

    // Handles the win condition and prompts the user to save their score
    const handleWinGame = () => {
      openPopup(
        "Game Is Over !",
        <p className="px-3 text-[17px]">
          Congratulations! You beat the game. Would you like to save it
          on-chain?
        </p>,
        "Mockey"
      );
      closeWindow();
    };

    // Defines the Phaser Scene for the Mockey game
    class MockeyScene extends Phaser.Scene {
      constructor() {
        super({ key: "MockeyScene" });
        this.direction = 0;
        this.ballLaunched = false;
        this.ballVelocity = 300;
        this.gameStarted = false;
      }

      // Preloads game assets including images and sounds
      preload() {
        this.load.image("board", "assets/games/mockey/board/board.png");
        this.load.image("paddle", "assets/games/mockey/paddle/paddle.png");
        this.load.image("ball", "assets/games/mockey/ball/ball.png");
        this.load.audio("background", "assets/games/mockey/audio/background.mp3");
        this.load.audio("goal", "assets/games/mockey/audio/goal.mp3");
        this.load.audio("goal2", "assets/games/mockey/audio/goal2.mp3");
        this.load.audio("paddleHit", "assets/games/mockey/audio/paddleHit.mp3");
        this.load.audio("borderHit", "assets/games/mockey/audio/borderHit.mp3");
      }

      // Creates the game scene, initializes paddles, ball, and event listeners
      create() {
        let bg = this.add.image(0, 0, "board");
        bg.displayWidth = this.sys.canvas.width;
        bg.displayHeight = this.sys.canvas.height;
        bg.setOrigin(0, 0);
        
        this.backgroundSound = this.sound.add("background", { loop: true });
        this.backgroundSound.setVolume(0.01);
        this.backgroundSound.play();
        this.goal = this.sound.add("goal");
        this.goal.setVolume(0.02);
        this.goal2 = this.sound.add("goal2");
        this.paddleHit = this.sound.add("paddleHit");
        this.paddleHit.setVolume(0.2);
        this.borderHit = this.sound.add("borderHit");
        this.borderHit.setVolume(0.2);

        this.ball = this.physics.add.sprite(315, 250, "ball");
        this.ball.setOrigin(0.5, 0.5);
        this.ball.setCollideWorldBounds(true);
        this.ball.body.onWorldBounds = true;

        this.paddle = this.physics.add.sprite(20, 250, "paddle");
        this.paddle.setOrigin(0, 0.5); // Paddle’ın sol orta noktasını referans al
        this.paddle.setImmovable(true);

        this.keeper = this.physics.add.sprite(610, 250, "paddle");
        this.keeper.setOrigin(1, 0.5); // Paddle’ın sağ orta noktasını referans al
        this.keeper.setImmovable(true);

        this.cursors = this.input.keyboard.createCursorKeys();

        this.playerScore = 0;
        this.keeperScore = 0;

        // **Paddle ile top çarpışma eventleri**
        this.physics.add.collider(
          this.paddle,
          this.ball,
          this.handlePaddleBounce,
          null,
          this
        );
        this.physics.add.collider(
          this.keeper,
          this.ball,
          this.handlePaddleBounce,
          null,
          this
        );
      }

      // Handles the game update loop, managing movement and collisions
      update(time, delta) {
        if (!hasStartedRef.current) return;

        if (!this.gameStarted) {
          this.launchBall(-1);
          this.gameStarted = true;
        }

        this.events.on("preupdate", () => {
          this.previousVelocityX = this.ball.body.velocity.x;
          this.previousVelocityY = this.ball.body.velocity.y;
        });

        if (!this.cursors.down.isDown && !this.cursors.up.isDown) {
          this.direction = 0;
        }

        if (Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
          this.direction = -1;
        }

        if (Phaser.Input.Keyboard.JustDown(this.cursors.down)) {
          this.direction = 1;
        }

        this.movePaddle(this.paddle, (delta / 3) * this.direction);
        this.movePaddle(this.keeper, (this.ball.y - this.keeper.y) * delta/200);

        this.lastCollisionTime = 0;

        this.physics.world.on("worldbounds", (body, up, down, left, right) => {
          let currentTime = this.time.now; // Phaser'ın mevcut zamanı (ms cinsinden)

          if (currentTime - this.lastCollisionTime < 100) {
            return;
          }

          this.lastCollisionTime = currentTime; // Son çarpışma zamanını güncelle

          if (up || down) {
            body.gameObject.setVelocity(
              body.velocity.x,
              -this.previousVelocityY
            );
            this.borderHit.play();
          }

          if (left && this.ballLaunched) {
            this.keeperScore++;
            updateDetails(this.playerScore, this.keeperScore);

            if (this.keeperScore >= 5) {
              this.endGame();
            }
            if (!this.goal2) {
              this.goal2 = this.sound.add("goal2");
            }
            this.goal2.stop();
            this.goal2.play();
            this.ballLaunched = false;
            this.resetBall("keeper");
          }

          if (right && this.ballLaunched) {
            this.playerScore++;
            updateDetails(this.playerScore, this.keeperScore);

            if (this.playerScore >= 5) {
              this.winGame();
            }
            this.goal.setVolume(0.02);
            this.goal.play();
            this.ballLaunched = false;
            this.resetBall("player");
          }
        });

        if (this.ball.body.velocity.x >= 800) {
          this.ball.body.velocity.x = 800;
        } else if (this.ball.body.velocity.x <= -800) {
          this.ball.body.velocity.x = -800;
        } else if (this.ball.body.velocity.y >= 400) {
          this.ball.body.velocity.y = 400;
        } else if (this.ball.body.velocity.y <= -400) {
          this.ball.body.velocity.y = -400;
        }
      }

      // Moves the paddles based on user input and AI logic
      movePaddle(paddle, y) {
        if (y == 0) return;

        paddle.y += y;

        if (paddle.y < paddle.height / 2) {
          paddle.y = paddle.height / 2;
        } else if (paddle.y > this.sys.canvas.height - paddle.height / 2) {
          paddle.y = this.sys.canvas.height - paddle.height / 2;
        }
      }

      // Launches the ball in a random direction at the start of the game
      launchBall(startingSide) {
        this.ball.setVelocity(
          startingSide * this.ballVelocity,
          this.ballVelocity * (Math.random() - 0.5)
        );
        this.ballLaunched = true;
      }

      // Resets the ball's position after a goal and determines the next serve
      resetBall(whoScored) {
        this.ball.setVelocity(0);

        if (whoScored === "player") {
          this.ball.setPosition(
            this.sys.canvas.width / 2 + 40,
            this.sys.canvas.height / 2
          );
        } else {
          this.ball.setPosition(
            this.sys.canvas.width / 2 - 40,
            this.sys.canvas.height / 2
          );
        }

        this.time.delayedCall(1000, () => {
          this.launchBall(whoScored === "player" ? 1 : -1);
        });
      }

      // Triggers the win condition when the player reaches the score threshold
      winGame() {
        handleWinGame();
      }

      // Ends the game when the AI keeper reaches the score threshold
      endGame() {
        handleEndGame(this.playerScore);
      }

      // Handles ball and paddle collision, adjusting the ball’s direction
      handlePaddleBounce(paddle, ball) {
        let previousSpeed = Math.sqrt(
          this.previousVelocityX ** 2 + this.previousVelocityY ** 2
        );

        let speedMultiplier = 1.2;
        let newSpeed = previousSpeed * speedMultiplier; // Önceki hız üzerinden artır

        let impact = (ball.y - paddle.y) / (paddle.height / 2);
        let maxBounceAngle = Math.PI / 4;
        let bounceAngle = impact * maxBounceAngle;

        let newVelocityX =
          Math.cos(bounceAngle) *
          newSpeed *
          (ball.x < this.sys.canvas.width / 2 ? 1 : -1);
        let newVelocityY = Math.sin(bounceAngle) * newSpeed;

        ball.setVelocity(newVelocityX, newVelocityY);
        let randomDetune = Phaser.Math.Between(400, 700);
        this.paddleHit.setDetune(randomDetune);
        this.paddleHit.play();
      }
    }

    // Phaser game configuration
    const config = {
      type: Phaser.AUTO,
      width: 630,
      height: 500,
      scene: MockeyScene,
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
      style={{ backgroundImage: "url('assets/games/snake/snake.png')" }}
    >
      <div ref={gameRef} className={`w-[630px] h-[500px] z-10 relative`}>
        <div className="flex absolute text-[#7b0000] text-5xl gap-[300px] left-1/2 -translate-x-1/2 top-7">
          <p>{playerScore}</p>
          <p>{keeperScore}</p>
        </div>
      </div>
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
    </div>
  );
};

Mockey.propTypes = {
  openPopup: PropTypes.func.isRequired,
  closeWindow: PropTypes.func.isRequired,
};

export default Mockey;
