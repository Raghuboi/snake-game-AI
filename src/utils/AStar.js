let open = [], closed = [], path = []

const aStar = (snake, apple, neighbours) => {
    open.splice(0)
    closed.splice(0)

    open[0] = {
        i: snake[0][0],
        j: snake[0][1],
        g: 0,
        f: getHValue({ i: snake[0][0], j: snake[0][1] }, apple),
        cameFrom: { i: snake[1][0], j: snake[1][1] }
    }

    while (open.length > 0) {
        let current = open[0]
        open.splice(0,1)
        closed.push(current)
        let i = current.i, j = current.j

        if (i === apple[0] && j === apple[1]) {
            break
        }

        neighbours.forEach(neighbour => {
            if (neighbour.collision || closed.includes(neighbour)) {
                return
            }

            getValues(neighbour, current, apple)

            for(let r = open.length -1 ; r >0 ; r--){
                if(open[r].f < open[r-1].f){
                    let temp = open[r-1];
                    open[r-1] = open[r];
                    open[r] = temp;
                }
            }
        })
    }

    path.splice(0)
    findPath()
}

const getValues = (neighbour, current, apple) => {
    let g = current.g + 1, h = getHValue(neighbour, apple), f = g + h

    if (!open.includes(neighbour)) {
        neighbour.g = g
        neighbour.h = h
        neighbour.f = f
        neighbour.cameFrom = current
        open.push(neighbour)
    }

    if (f < neighbour.f) {
        neighbour.g = g
        neighbour.h = h
        neighbour.f = f
        neighbour.cameFrom = current
    } 
}

const getHValue = (node, apple) => {
    let diffX = apple[0] - node.i;
    let diffY = apple[1] - node.j;
    
    return Math.sqrt(Math.pow(diffX,2) + Math.pow(diffY,2));
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

module.exports = { aStar }