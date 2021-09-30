import React, { useState, useRef, useEffect } from "react";
import { useInterval } from "../utils/useInterval.js";
import {
  SCALE,
  CANVAS_SIZE,
  SNAKE_START,
  APPLE_START,
  SPEED,
  DIRECTIONS
} from "../utils/constants";

import { aStar } from "../utils/AStar.js";
import { greedy } from "../utils/Greedy.js"

export default function Game() {
    const canvasRef = useRef();
    const [snake, setSnake] = useState(SNAKE_START)
    const [apple, setApple] = useState(APPLE_START)
    const [dir, setDir] = useState([0, -1])
    const [speed, setSpeed] = useState(null)
    const [gameOver, setGameOver] = useState(false)

    const [path, setPath] = useState(null)
    const [pathToggle, setPathToggle] = useState(false)
    const [closedToggle, setClosedToggle] = useState(false)
    const [closed, setClosed] = useState(null)

    const [aStarToggle, setAStarToggle] = useState(false)
    const [greedyToggle, setGreedyToggle] = useState(false)
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
      setAStarToggle(false)
      setGreedyToggle(false)
      setPathToggle(false)
      setClosedToggle(false)
    };
  
    const moveSnake = ({ keyCode }) => {
        /*if (
            Math.abs(dir[0]) === Math.abs(DIRECTIONS[keyCode][0])
            || Math.abs(dir[1]) === Math.abs(DIRECTIONS[keyCode][1])
        ) return*/ 
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
    }
  
    const startGame = () => {
        setSnake(SNAKE_START);
        setApple(APPLE_START);
        setDir([0, -1]);
        setSpeed(SPEED);
        setGameOver(false);
    }

    const drawLine = (path) => {
      const ctx = canvasRef.current.getContext("2d")
     
      ctx.strokeStyle = "blue";
      for(let i=1; i<path.length -3; i++){
          ctx.beginPath();
          ctx.moveTo(path[i].i+0.5, path[i].j+0.5);
          ctx.lineTo(path[i+1].i+0.5, path[i+1].j+0.5);
          ctx.lineWidth = 0.05
          ctx.stroke();
          ctx.closePath();
      }
    }

    const drawClosed = (closed) => {
      const context = canvasRef.current.getContext("2d")
      context.globalAlpha = 0.2
      context.fillStyle = "white"
      closed && closed.forEach(({i, j}) => context.fillRect(i, j, 1, 1))
      context.globalAlpha =1

    }
  
    useEffect(() => {
        const context = canvasRef.current.getContext("2d");
        context.clearRect(0, 0, window.innerWidth, window.innerHeight);
        if (aStarToggle) {
          context.fillStyle = (survivalMode) ? "green" : "purple"
        }    
        else if (greedyToggle) context.fillStyle = "yellow"
        else context.fillStyle = "#6CBB3C";
        snake.forEach(([x, y]) => context.fillRect(x, y, 1, 1));
        context.fillStyle = "#EB4C42";
        context.fillRect(apple[0], apple[1], 1, 1);

        !gameOver && pathToggle && path && drawLine(path)
        !gameOver && closedToggle && closed && drawClosed(closed)

    }, [snake, apple, gameOver, path])

    useEffect(() => {
      const snakeHead = snake[0]

      if (aStarToggle) {
        setGreedyToggle(false)
        var newPath = null;
    
        const result = aStar(snake, apple[0], apple[1], SCALE, CANVAS_SIZE)
        newPath = result.path
        setSurvivalMode(result.survivalMode)
        setClosed(result.closed)

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

      else if (greedyToggle) {
        setAStarToggle(false)

        var newPath = null;
    
        const result = greedy(snake, apple[0], apple[1], SCALE, CANVAS_SIZE)
        newPath = result.path
        setClosed(result.closed)

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

    useEffect(()=>{
      if (aStarToggle || aStarToggle) startGame()
    },[aStarToggle, greedyToggle])
  
    return (
      <div className="game-components">
      <div className="game">
        <h1>Snake AI</h1>
        <canvas
          style={{ border: "3px solid white" }}
          ref={canvasRef}
          width={`${CANVAS_SIZE[0]}px`}
          height={`${CANVAS_SIZE[1]}px`}
        />
      </div>
      <div className="buttons">
        {gameOver && <div>GAME OVER!</div>}
        <button onClick={startGame}>Start Game</button>
        <button onClick={()=> {
          setAStarToggle(!aStarToggle)
          setGreedyToggle(false)
        }}>{(aStarToggle) ? "A* (on)" : "A*"}</button>
        <button onClick={()=> {
          setGreedyToggle(!greedyToggle)
          setAStarToggle(false)
        }}>{(greedyToggle) ? "Greedy (on)" : "Greedy"}</button>
        {(aStarToggle || greedyToggle) &&
        <div className="checkboxes">
          <div className="checkbox-item"><h4>Scanned</h4>
          <input type="checkbox" onChange={e => {
            if (e.target.checked) setClosedToggle(true)
            else setClosedToggle(false)
          }}/></div>
        <div className="checkbox-item"><h4>Path</h4> 
          <input type="checkbox" onChange={e => {
            if (e.target.checked) setPathToggle(true)
            else setPathToggle(false)
          }}/></div>
          </div>}
      </div>
    </div>
    )
}