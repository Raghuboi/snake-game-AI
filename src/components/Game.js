import React, { useState, useRef, useEffect } from "react";
import { useInterval } from "../utils/useInterval.js";
import {
  CANVAS_SIZE,
  SNAKE_START,
  APPLE_START,
  SCALE,
  SPEED,
  DIRECTIONS
} from "../utils/constants";

import { aStar } from "../utils/AStar.js";

export default function Game() {
    const canvasRef = useRef();
    const [snake, setSnake] = useState(SNAKE_START)
    const [apple, setApple] = useState(APPLE_START)
    const [dir, setDir] = useState([0, -1])
    const [speed, setSpeed] = useState(null)
    const [gameOver, setGameOver] = useState(false)
    const [path, setPath] = useState(null)

    const [aStarToggle, setAStarToggle] = useState(false)
    const [survivalMode, setSurvivalMode] = useState(false)
  
    useInterval(() => gameLoop(), speed);

    useEffect(() => {
        const context = canvasRef.current.getContext("2d");
        context.setTransform(SCALE, 0, 0, SCALE, 0, 0);
        document.addEventListener('keydown', moveSnake)
    }, [])
  
    const endGame = () => {
      setSpeed(null);
      setGameOver(true);
    };
  
    const moveSnake = ({ keyCode }) => {
       /* if (
            Math.abs(dir[0]) === Math.abs(DIRECTIONS[keyCode][0])
            || Math.abs(dir[1]) === Math.abs(DIRECTIONS[keyCode][1])
        ) return */
        keyCode >= 37 && keyCode <= 40 && setDir(DIRECTIONS[keyCode])
    }
  
    const createApple = () =>
      apple.map((_a, i) => Math.floor(Math.random() * (CANVAS_SIZE[i] / SCALE)));
  
    const checkCollision = (piece, snk = snake) => {

      if (
        piece[0] * SCALE >= CANVAS_SIZE[0] ||
        piece[0] < 0 ||
        piece[1] * SCALE >= CANVAS_SIZE[1] ||
        piece[1] < 0
      )
        return true;
  
      for (const segment of snk) {
        if (piece[0] === segment[0] && piece[1] === segment[1]) return true;
      }
      return false;
    };
  
    const checkAppleCollision = newSnake => {
      if (newSnake[0][0] === apple[0] && newSnake[0][1] === apple[1]) {
        var newApple = createApple();
        while (checkCollision(newApple, newSnake)) {
          newApple = createApple();
        }
        setApple(newApple);
        return true;
      }
      return false;
    }

    const gameLoop = () => {
      const snakeCopy = JSON.parse(JSON.stringify(snake));
      const newSnakeHead = [snakeCopy[0][0] + dir[0], snakeCopy[0][1] + dir[1]];
      snakeCopy.unshift(newSnakeHead);
      if (checkCollision(newSnakeHead)) endGame();
      if (!checkAppleCollision(snakeCopy)) snakeCopy.pop();
      setSnake(snakeCopy);

      /*if (aStarToggle) {
        let newPath = aStar(snakeCopy, apple[0], apple[1], SCALE, CANVAS_SIZE)
        newPath && setPath(newPath)

        if(newPath && newPath.length>=2) {
          var last = [ newPath[newPath.length-1].i, newPath[newPath.length-1].j ]
          var secondLast = [ newPath[newPath.length-2].i, newPath[newPath.length-2].j ]
          var newDir = [ secondLast[0]-last[0], secondLast[1]-last[1] ]
          if (last[0]===newSnakeHead[0] && last[1]===newSnakeHead[1]) {
            dir!==newDir && setDir(newDir)
          }
        }
      }*/
    }
  
    const startGame = () => {
        setSnake(SNAKE_START);
        setApple(APPLE_START);
        setDir([0, -1]);
        setSpeed(SPEED);
        setGameOver(false);
    };
  
    useEffect(() => {
        const context = canvasRef.current.getContext("2d");
        context.clearRect(0, 0, window.innerWidth, window.innerHeight);
        if (aStarToggle) {
          context.fillStyle = (survivalMode) ? "green" : "red"

        }
        else context.fillStyle = "pink";
        snake.forEach(([x, y]) => context.fillRect(x, y, 1, 1));
        context.fillStyle = "lightblue";
        context.fillRect(apple[0], apple[1], 1, 1);
        
        
        /*path.forEach(({i, j}) => {
          context.fillStyle = "green"
          context.fillRect(i, j, 1, 1)
        })*/
    }, [snake, apple, gameOver])

    useEffect(() => {
      const snakeHead = snake[0]

      if (aStarToggle) {
        var newPath = null;
      
        //if (!path || path.length<2) {
          const result = aStar(snake, apple[0], apple[1], SCALE, CANVAS_SIZE)
          newPath = result.path
          setSurvivalMode(result.survivalMode)
        //}

        /*else if (path) {
          newPath = path.slice(0, path.length-1)
        }*/ 

        newPath && setPath(newPath)
        const length = newPath.length

        if(newPath && length>=2) {
          const last = [ newPath[length-1].i, newPath[length-1].j ]
          const secondLast = [ newPath[length-2].i, newPath[length-2].j ]
          const newDir = [ secondLast[0]-last[0], secondLast[1]-last[1] ]

          if (
            Math.abs(dir[0]) === Math.abs(newDir[0])
            || Math.abs(dir[1]) === Math.abs(newDir[1])
        ) return 

          else if (last[0]===snakeHead[0] && last[1]===snakeHead[1]) {
            dir!==newDir && setDir(newDir)
          }
        }
      }
    }, [snake, apple, gameOver])
  
    return (
      <>
        <canvas
          style={{ border: "1px solid black" }}
          ref={canvasRef}
          width={`${CANVAS_SIZE[0]}px`}
          height={`${CANVAS_SIZE[1]}px`}
        />
        {gameOver && <div>GAME OVER!</div>}
        <button onClick={startGame}>Start Game</button>
        <button onClick={()=> {setAStarToggle(!aStarToggle)}}>A* Algorithm</button>
        </>
    )
}