import { useCallback, useEffect, useRef, useState } from "react";
import Phaser from "phaser";
import PropTypes from "prop-types";

const Tetris = ({ openPopup, closeWindow }) => {
  const gameRef = useRef(null);
  const [nextTetriminoImage, setNextTetriminoImage] = useState("assets/games/tetris/shapes/next-j.png");
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
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
    // Updates the next Tetrimino image in the UI
    const updateNextTetriminoImage = (imagePath) => {
      setNextTetriminoImage(imagePath);
    };

    // Updates score and level states when a line is cleared
    const updateDetails = ( _score, _level) => {
      setScore(_score);
      setLevel(_level);
    };
    
    // Handles game over scenario and triggers a popup with the final score
    const endGame = (_score) => {
      openPopup(
        "Game Is Over !",
        <p className="px-3 text-[17px]">
          Your score is <span className="font-bold">{_score}</span>. Would you like to save it on-chain, or replay to achieve a higher score?
        </p>,
        "Tetris"
      );
      closeWindow();
    };

    // Defines different Tetrimino shapes and their rotations
    const tetriminos = {
      i: [
        [
          [1, 1, 1, 1],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
        ],
        [
          [1, 0, 0, 0],
          [1, 0, 0, 0],
          [1, 0, 0, 0],
          [1, 0, 0, 0],
        ],
      ],
      j: [
        [
          [1, 0, 0],
          [1, 1, 1],
          [0, 0, 0],
        ],
        [
          [1, 1, 0],
          [1, 0, 0],
          [1, 0, 0],
        ],
        [
          [1, 1, 1],
          [0, 0, 1],
          [0, 0, 0],
        ],
        [
          [0, 1, 0],
          [0, 1, 0],
          [1, 1, 0],
        ],
      ],
      l: [
        [
          [0, 0, 1],
          [1, 1, 1],
          [0, 0, 0],
        ],
        [
          [1, 0, 0],
          [1, 0, 0],
          [1, 1, 0],
        ],
        [
          [1, 1, 1],
          [1, 0, 0],
          [0, 0, 0],
        ],
        [
          [1, 1, 0],
          [0, 1, 0],
          [0, 1, 0],
        ],
      ],
      o: [
        [
          [1, 1],
          [1, 1],
        ],
        [
          [1, 1],
          [1, 1],
        ],
      ],
      s: [
        [
          [0, 1, 1],
          [1, 1, 0],
          [0, 0, 0],
        ],
        [
          [1, 0, 0],
          [1, 1, 0],
          [0, 1, 0],
        ],
      ],
      t: [
        [
          [0, 1, 0],
          [1, 1, 1],
          [0, 0, 0],
        ],
        [
          [1, 0, 0],
          [1, 1, 0],
          [1, 0, 0],
        ],
        [
          [1, 1, 1],
          [0, 1, 0],
          [0, 0, 0],
        ],
        [
          [0, 1, 0],
          [1, 1, 0],
          [0, 1, 0],
        ],
      ],
      z: [
        [
          [1, 1, 0],
          [0, 1, 1],
          [0, 0, 0],
        ],
        [
          [0, 1, 0],
          [1, 1, 0],
          [1, 0, 0],
        ],
      ],
    };

    // Stores rotation state adjustments for each Tetrimino type
    const rotationStates = {
      l: {
        0: [0, 1],
        1: [1, -1],
        2: [-1, 1],
        3: [0, -1],
      },
      j: {
        0: [0, 1],
        1: [1, -1],
        2: [-1, 1],
        3: [0, -1],
      },
      t: {
        0: [0, 0],
        1: [1, -1],
        2: [-1, 1],
        3: [0, 0],
      },
      s: {
        0: [-1, 1],
        1: [1, -1],
      },
      z: {
        0: [-1, 1],
        1: [1, -1],
      },
      i: {
        0: [-1, 1],
        1: [1, -1],
      },
      o: {
        0: [0, 0],
      },
    };

    let gameOver = false;

    let lines = 0;
    let score = 0;
    let level = 1;

    // Defines the Phaser Scene for the Tetris game
    class TetrisScene extends Phaser.Scene {
      constructor() {
        super({ key: "TetrisScene" });
        this.gameBoard = [];
        this.currentTetrimino = null;
        this.blockSprites = [];
        for (let i = 0; i < 20; i++) {
          this.blockSprites[i] = new Array(10).fill(null);
        }
      }

      // Preloads game assets including images and sounds
      preload() {
        this.load.image("j", "assets/games/tetris/shapes/J.png");
        this.load.image("i", "assets/games/tetris/shapes/I.png");
        this.load.image("l", "assets/games/tetris/shapes/L.png");
        this.load.image("z", "assets/games/tetris/shapes/Z.png");
        this.load.image("s", "assets/games/tetris/shapes/S.png");
        this.load.image("t", "assets/games/tetris/shapes/T.png");
        this.load.image("o", "assets/games/tetris/shapes/O.png");
        this.load.image("j1", "assets/games/tetris/shapes/J1.png");
        this.load.image("i1", "assets/games/tetris/shapes/I1.png");
        this.load.image("l1", "assets/games/tetris/shapes/L1.png");
        this.load.image("z1", "assets/games/tetris/shapes/Z1.png");
        this.load.image("s1", "assets/games/tetris/shapes/S1.png");
        this.load.image("t1", "assets/games/tetris/shapes/T1.png");
        this.load.image("j2", "assets/games/tetris/shapes/J2.png");
        this.load.image("l2", "assets/games/tetris/shapes/L2.png");
        this.load.image("t2", "assets/games/tetris/shapes/T2.png");
        this.load.image("j3", "assets/games/tetris/shapes/J3.png");
        this.load.image("l3", "assets/games/tetris/shapes/L3.png");
        this.load.image("t3", "assets/games/tetris/shapes/T3.png");
        this.load.image("block-j", "assets/games/tetris/blocks/block-j.png");
        this.load.image("block-i", "assets/games/tetris/blocks/block-i.png");
        this.load.image("block-l", "assets/games/tetris/blocks/block-l.png");
        this.load.image("block-z", "assets/games/tetris/blocks/block-z.png");
        this.load.image("block-s", "assets/games/tetris/blocks/block-s.png");
        this.load.image("block-t", "assets/games/tetris/blocks/block-t.png");
        this.load.image("block-o", "assets/games/tetris/blocks/block-o.png");
        this.load.image("next-j", "assets/games/tetris/shapes/next-j.png");
        this.load.image("next-i", "assets/games/tetris/shapes/next-i.png");
        this.load.image("next-l", "assets/games/tetris/shapes/next-l.png");
        this.load.image("next-z", "assets/games/tetris/shapes/next-z.png");
        this.load.image("next-s", "assets/games/tetris/shapes/next-s.png");
        this.load.image("next-t", "assets/games/tetris/shapes/next-t.png");
        this.load.image("next-o", "assets/games/tetris/shapes/next-o.png");
        this.load.image("board", "assets/games/tetris/board/board.png");
        this.load.audio("lineClear", "assets/games/tetris/audio/lineclear.mp3");
        this.load.audio("soundTheme", "assets/games/tetris/audio/soundtheme.mp3");

        this.load.on("complete", () => {
          const oTetrimino = this.textures.get("o").getSourceImage();
          this.blockSize = oTetrimino.width / 2;
        });
      }

      // Creates the game scene, initializes the board and starts the game
      create() {
        let bg = this.add.image(0, 0, "board");
        this.lineClear = this.sound.add("lineClear");
        this.soundTheme = this.sound.add("soundTheme", { loop: true });
        this.soundTheme.play();
        this.soundTheme.setVolume(0.05);
        bg.setOrigin(0, 0);
        bg.displayWidth = this.sys.game.config.width;
        bg.displayHeight = this.sys.game.config.height;
        for (let i = 0; i < 20; i++) {
          this.gameBoard[i] = [];
          for (let j = 0; j < 10; j++) {
            this.gameBoard[i][j] = 0;
          }
        }
        this.hasStarted = false;
        this.moveCounter = 0;
        this.moveInterval = 60;
        this.spawnTetrimino();

        this.cursors = this.input.keyboard.createCursorKeys();
      }

      // Spawns a new Tetrimino at the start location and updates the next piece preview
      spawnTetrimino() {
        const tetriminos = ["j", "i", "l", "z", "s", "t", "o"];

        if (!this.nextTetriminoType) {
          const randIndex = Math.floor(Math.random() * tetriminos.length);
          this.nextTetriminoType = tetriminos[randIndex];
        }
        this.currentTetriminoType = this.nextTetriminoType;
        const randIndex = Math.floor(Math.random() * tetriminos.length);
        this.nextTetriminoType = tetriminos[randIndex];
        updateNextTetriminoImage(
          "assets/games/tetris/shapes/next-" + this.nextTetriminoType + ".png"
        );

        this.currentTetrimino = this.physics.add.image(
          0,
          this.blockSize,
          this.currentTetriminoType
        );
        const tetriminoWidth =
          this.currentTetrimino.displayWidth / this.blockSize;
        const xOffset =
          tetriminoWidth % 2 == 0
            ? (this.blockSize * (10 - tetriminoWidth)) / 2
            : 3 * this.blockSize;
        this.currentTetrimino.x = xOffset;
        this.currentTetrimino.y = 0;
        this.currentTetrimino.rotationState = 0;
        this.currentTetrimino.setOrigin(0, 0);
        this.physics.world.enable(this.currentTetrimino);
        this.currentTetrimino.body.collideWorldBounds = true;
        this.currentTetrimino.blocks = this.calculateBlockPositions(
          this.currentTetriminoType,
          0
        );
        gameOver = this.isGameOver();
        if(gameOver) {
          endGame(score);
        }
      }

      // Spawns a new Tetrimino at the custom location and updates the next piece preview
      spawnTetriminoAt(type, x, y, rotationState) {
        this.currentTetrimino = this.physics.add.image(0, this.blockSize, type);
        this.currentTetrimino.setOrigin(0, 0);
        this.physics.world.enable(this.currentTetrimino);
        this.currentTetrimino.body.collideWorldBounds = true;
        this.currentTetrimino.x =
          x +
          rotationStates[this.currentTetriminoType][rotationState][0] *
            this.blockSize;
        this.currentTetrimino.y =
          y +
          rotationStates[this.currentTetriminoType][rotationState][1] *
            this.blockSize;
        this.currentTetrimino.rotationState = rotationState;
        this.currentTetrimino.blocks = this.calculateBlockPositions(
          this.currentTetriminoType,
          rotationState
        );
      }

      // Checks if the game is over by calculating block positions
      isGameOver() {
        let spawnLocations = {
          i: [0, 3],
          o: [0, 4],
          default: [0, 3],
        };
        let spawnLocation =
          spawnLocations[this.currentTetriminoType] ||
          spawnLocations["default"];
        let blockPositions = this.calculateBlockPositions(
          this.currentTetriminoType,
          this.currentTetrimino.rotationState
        );
        for (let block of blockPositions) {
          let x = spawnLocation[1] + block.x;
          let y = spawnLocation[0] + block.y;
          if (this.gameBoard[y] && this.gameBoard[y][x] === 1) {
            return true;
          }
        }
        return false;
      }

      // Calculating block positions
      calculateBlockPositions(type, rotationState) {
        const positions = [];
        const matrix = tetriminos[type][rotationState];

        for (let i = 0; i < matrix.length; i++) {
          for (let j = 0; j < matrix[i].length; j++) {
            if (matrix[i][j] == 1) {
              positions.push({ x: j, y: i });
            }
          }
        }
        return positions;
      }

      // Handles rotation logic for the current Tetrimino
      rotate() {
        const numberOfstates = {
          i: 2,
          j: 4,
          l: 4,
          t: 4,
          s: 2,
          z: 2,
          o: 1,
        };
        let rotationState =
          (this.currentTetrimino.rotationState + 1) %
          numberOfstates[this.currentTetriminoType];
        let allowRotation = this.isRotationValid(
          this.currentTetriminoType,
          rotationState
        );
        if (!allowRotation) return;
        const x = this.currentTetrimino.x;
        const y = this.currentTetrimino.y;
        this.currentTetrimino.rotationState = rotationState;
        let rotatedType =
          rotationState == 0
            ? this.currentTetriminoType
            : this.currentTetriminoType + rotationState;
        this.currentTetrimino.destroy();
        this.spawnTetriminoAt(rotatedType, x, y, rotationState);
        this.checkAndHandleLandedTetrimino();
      }

      // Checks if a rotation is valid before executing it
      isRotationValid(type, rotationState) {
        let rotationValid = true;
        const positions = [];
        const matrix = tetriminos[type][rotationState];
        for (let i = 0; i < matrix.length; i++) {
          for (let j = 0; j < matrix.length; j++) {
            if (matrix[i][j] === 1) {
              positions.push({ x: j, y: i });
            }
          }
        }
        positions.forEach((block) => {
          let currentTetriminox =
            this.currentTetrimino.x +
            rotationStates[this.currentTetriminoType][rotationState][0] *
              this.blockSize;
          let currentTetriminoy =
            this.currentTetrimino.y +
            rotationStates[this.currentTetriminoType][rotationState][1] *
              this.blockSize;
          const x = Math.floor(
            (currentTetriminox + block.x * this.blockSize) / this.blockSize
          );
          const y = Math.floor(
            (currentTetriminoy + block.y * this.blockSize) / this.blockSize
          );
          if (x > 9 || x < 0 || y < 0 || y > 19) {
            rotationValid = false;
          } else if (this.gameBoard[y][x] == 1) rotationValid = false;
        });
        return rotationValid;
      }

      // Custom made gravity, input management, and all tick based systems
      update() {
        if (!hasStartedRef.current) return;

        this.moveCounter++;
        if (this.currentTetrimino && this.moveCounter >= this.moveInterval) {
          this.setTetriminoOnBoard(0);
          this.currentTetrimino.y += this.blockSize;
          this.moveCounter = 0;
          this.setTetriminoOnBoard(2);
          this.time.delayedCall(500, () => {
            this.checkAndHandleLandedTetrimino();
          });
        }

        if (!this.currentTetrimino) return;

        if (Phaser.Input.Keyboard.JustDown(this.cursors.left)) {
          if (!this.isMoveValid(-1)) return;
          this.setTetriminoOnBoard(0);
          this.currentTetrimino.x -= this.blockSize;
          this.setTetriminoOnBoard(2);
          this.checkAndHandleLandedTetrimino();
        }

        if (Phaser.Input.Keyboard.JustDown(this.cursors.right)) {
          if (!this.isMoveValid(1)) return;
          this.setTetriminoOnBoard(0);
          this.currentTetrimino.x += this.blockSize;
          this.setTetriminoOnBoard(2);
          this.checkAndHandleLandedTetrimino();
        }

        if (this.cursors.down.isDown && this.moveCounter % 3 == 0) {
          this.setTetriminoOnBoard(0);
          if (!this.hasLanded()) {
            this.currentTetrimino.y += this.blockSize;
          }
          this.setTetriminoOnBoard(2);
          if (this.hasLanded()) {
            this.landTetrimino();
          }
        }

        if (
          Phaser.Input.Keyboard.JustDown(this.cursors.up) &&
          !this.hasLanded()
        ) {
          this.setTetriminoOnBoard(0);
          this.rotate();
          this.setTetriminoOnBoard(2);
        }

        if (Phaser.Input.Keyboard.JustDown(this.cursors.space)) {
          while (!this.hasLanded()) {
            this.currentTetrimino.y += this.blockSize;
          }
          this.landTetrimino();
        }
      }

      //Convert landed tetrominoes to blocks
      checkAndHandleLandedTetrimino() {
        if (this.hasLanded()) {
          this.setTetriminoOnBoard(0);
          this.landTetrimino();
        }
      }

      // Checks if a move is valid before executing it
      isMoveValid(direction) {
        let moveValid = true;
        this.currentTetrimino.blocks.forEach((block) => {
          const x = Math.floor(
            (this.currentTetrimino.x + block.x * this.blockSize) /
              this.blockSize
          );
          const y = Math.floor(
            (this.currentTetrimino.y + block.y * this.blockSize) /
              this.blockSize
          );

          if (
            this.gameBoard[y][x + direction] == 1 ||
            x + direction < 0 ||
            x + direction > 9
          ) {
            moveValid = false;
          }
        });
        return moveValid;
      }
      
      // Sets the Tetrimino's position on the game board
      setTetriminoOnBoard(value) {
        this.currentTetrimino.blocks.forEach((block) => {
          const x = Math.floor(
            (this.currentTetrimino.x + block.x * this.blockSize) /
              this.blockSize
          );
          const y = Math.floor(
            (this.currentTetrimino.y + block.y * this.blockSize) /
              this.blockSize
          );

          if (x >= 0 && x < 10 && y >= 0 && y < 20) {
            this.gameBoard[y][x] = value;
          }
        });
      }

      // Checks if the current Tetrimino has landed on the ground
      hasLanded() {
        for (let block of this.currentTetrimino.blocks) {
          const x = Math.floor(
            (this.currentTetrimino.x + block.x * this.blockSize) /
              this.blockSize
          );
          const y = Math.floor(
            (this.currentTetrimino.y + block.y * this.blockSize) /
              this.blockSize
          );

          if (y >= 19) {
            return true;
          }
          if (y < 20 && x < 10 && this.gameBoard[y + 1][x] == 1) {
            return true;
          }
        }
        return false;
      }

      // Finalizes the Tetrimino position and replaces it with static blocks
      landTetrimino() {
        this.setTetriminoOnBoard(1);
        this.replaceTetriminoWithBlocks();
        this.checkLines();
        this.spawnTetrimino();
      }

      // Replaces Tetrimino sprites with fixed block images
      replaceTetriminoWithBlocks() {
        for (let block of this.currentTetrimino.blocks) {
          let x = this.currentTetrimino.x + block.x * this.blockSize;
          let y = this.currentTetrimino.y + block.y * this.blockSize;
          let blockSprite = this.physics.add.image(
            x,
            y,
            "block-" + this.currentTetriminoType
          );
          blockSprite.setOrigin(0, 0);
          this.physics.world.enable(blockSprite);
          let i = Math.floor(y / this.blockSize);
          let j = Math.floor(x / this.blockSize);
          this.blockSprites[i][j] = blockSprite;
        }
        this.currentTetrimino.destroy();
        this.currentTetrimino = null;
      }

      // Checks for full lines and clears them if necessary
      checkLines() {
        let linesToRemove = [];
        let completedTweenCount = 0;
        for (let i = 19; i >= 0; i--) {
          if (this.gameBoard[i].every((cell) => cell === 1)) {
            for (let j = 0; j < 10; j++) {
              let blockSprite = this.blockSprites[i][j];
              if (blockSprite !== null) {
                this.lineClear.play();
                this.tweens.add({
                  targets: blockSprite,
                  alpha: 0,
                  ease: "Power1",
                  duration: 50,
                  yoyo: true,
                  repeat: 3,
                  onComplete: () => {
                    blockSprite.destroy();
                    completedTweenCount++;
                    if (completedTweenCount === linesToRemove.length * 10) {
                      this.updateScoreAndLevel(linesToRemove);
                      this.shiftBlocks(linesToRemove);
                    }
                  },
                });
                this.blockSprites[i][j] = null;
              }
            }
            this.gameBoard[i] = new Array(10).fill(0);
            linesToRemove.push(i);
          }
        }
      }

      // Shifts blocks downward when lines are cleared
      shiftBlocks(linesToRemove) {
        for (let line of linesToRemove.reverse()) {
          for (let k = line; k >= 1; k--) {
            for (let j = 0; j < 10; j++) {
              this.blockSprites[k][j] = this.blockSprites[k - 1][j];
              if (this.blockSprites[k][j] !== null) {
                this.blockSprites[k][j].y += this.blockSize;
              }
            }
            this.gameBoard[k] = [...this.gameBoard[k - 1]];
          }
          this.gameBoard[0] = new Array(10).fill(0);
          this.blockSprites[0] = new Array(10).fill(null);
        }
      }

      // Updates score and level when lines are cleared
      updateScoreAndLevel(linesToRemove) {
        let linesCleared = linesToRemove.length;
        if (linesCleared > 0) {
          let scores = [0, 40, 100, 300, 1200];
          score += scores[linesCleared] * level;
          lines += linesCleared;
          level = Math.floor(lines / 10 + 1);
          this.moveInterval = Math.max(3, Math.floor(60 / level));
          updateDetails(score, level);
        }
      }
    }
    
    // Phaser game configuration
    const config = {
      type: Phaser.AUTO,
      width: 200,
      height: 400,
      scene: TetrisScene,
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
      style={{ backgroundImage: "url('/assets/games/tetris/tetris.png')" }}
    >
      <div
        ref={gameRef}
        className={`w-[200px] h-[400px] z-10 ml-[128px] mt-[50px]`}
      />
      {!hasStarted && (
        <div onClick={startGame} className="cursor-pointer absolute flex w-full h-full z-10">
          <div className="bg-black absolute w-full h-full opacity-90"></div>
          <img src="assets/p2s.gif" className="z-10 w-[350px] h-[200px] mx-auto mb-12 mt-auto" alt="" />
        </div>
      )}
      <div className="w-[60px] ml-[105px] mt-[44px] text-[18px] text-white flex flex-col gap-4">
        <img className="h-[60px] w-[60px]" src={nextTetriminoImage} alt="" />
        <p className="w-[40px] ml-[11px] mt-[10px] text-[24px] text-center font-bold">{level}</p>
        <p className="w-[40px] ml-[11px] mt-[21px] text-[24px] text-center font-bold">{score}</p>
      </div>
    </div>
  );
};

Tetris.propTypes = {
  openPopup: PropTypes.func.isRequired,
  closeWindow: PropTypes.func.isRequired,
};

export default Tetris;