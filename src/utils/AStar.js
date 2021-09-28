let open = [], closed = [], path = [], neighbours = []

export const aStar = (snake, appleX, appleY, SCALE, CANVAS_SIZE) => {   
    console.log("AStar start")

    closed.splice(0)

    const snakeHeadX = snake[0][0]
    const snakeHeadY = snake[0][1]

    open = [{
        i: snakeHeadX,
        j: snakeHeadY,
        g: 0,
        f: getHValue({ i: snakeHeadX, j: snakeHeadY }, appleX, appleY),
        cameFrom: null
        //cameFrom: { i: snake[1][0], j: snake[1][1] }
    }]

    while (open.length) {
        console.log("AStar while loop entered")

        const current = open[0]
        open.splice(0,1)
        closed.push(current)
        const i = current.i, j = current.j

        if (i === appleX && j === appleY) {
            console.log("AStar found Apple")
            break
        }

        const left = { 
            i: i-1, 
            j: j,
        } 
    
        const right = {
            i: i+1,
            j: j,
        } 
    
        const up = {
            i: i,
            j: j-1,
        } 
    
        const down = {
            i: i,
            j: j+1,
        }
    
        neighbours = [left,right,up,down]

        neighbours.forEach((neighbour) => {

            const { i, j } = neighbour
            if (checkCollision(i, j, snake, SCALE, CANVAS_SIZE) || closed.includes(neighbour)) {
                return
            }

            else {
            getValues(i, j, neighbour, current, appleX, appleY)

            for(let r = open.length -1 ; r >0 ; r--){
                if(open[r].f < open[r-1].f){
                    const temp = open[r-1];
                    open[r-1] = open[r];
                    open[r] = temp;
                }
            }
        }
        })
        
    }

    path.splice(0)
    findPath()
    console.log("AStar finished")
    console.log("------------------")
    return path
}

const checkCollision = (i, j, snake, SCALE, CANVAS_SIZE) => {

    if (
      i * SCALE >= CANVAS_SIZE[0] ||
      i < 0 ||
      j * SCALE >= CANVAS_SIZE[1] ||
      j < 0
    )
      return true;

    for (const segment of snake) {
      if (i === segment[0] && j === segment[1]) {
          return true
      }
    }
    return false;
  }

const getValues = (i, j, neighbour, current, appleX, appleY) => {
    const g = current.g + 1, h = getHValue(i, j, appleX, appleY), f = g + h

    if (!open.includes(neighbour)) {
        neighbour.g = g
        neighbour.h = h
        neighbour.f = f
        neighbour.cameFrom = current
        open.push(neighbour)
    }

    else if (f < neighbour.f) {
        neighbour.g = g
        neighbour.h = h
        neighbour.f = f
        neighbour.cameFrom = current
    } 

    /*if (!open.includes(neighbour) || f < neighbour.f ) {
        neighbour.g = g
        neighbour.h = h
        neighbour.f = f
        neighbour.cameFrom = current
        if (!open.includes(neighbour)) open.push(neighbour)
    }*/
}

const getHValue = (nodeX, nodeY, appleX, appleY) => {
    const diffX = appleX - nodeX;
    const diffY = appleY - nodeY;
    
    return Math.floor(Math.sqrt(Math.pow(diffX,2) + Math.pow(diffY,2)) * 10);
}

const findPath = () => {
    let previous = '';
    for(let i = closed.length - 1; i>=0; i--){
        
        if(i === closed.length - 1 && previous === ''){
            previous = closed[i];
            path.push(previous);
        }
        else if(previous.cameFrom.i === closed[i].i && previous.cameFrom.j === closed[i].j){
            previous = closed[i];
            path.push(previous);
        }            
    }
}