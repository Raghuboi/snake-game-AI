let open = [], closed = [], path = []

const aStar = (snake, apple, neighbours) => {

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
        //console.log({i: i, j: j, appleX: apple[0], appleY: apple[1]})

        if (i === apple[0] && j === apple[1]) break

        neighbours.forEach(neighbour => {
            if (neighbour.collision || closed.includes(neighbour)) return

            let newNeighbour = getValues(neighbour, current, apple)

            console.log(newNeighbour)
        })
    }

    path.splice(0)
    findPath()
}

const getValues = (neighbour, current, apple) => {
    let g = current.g + 1, h = getHValue(neighbour, apple), f = g + h

    if (f < neighbour.f || !open.includes(neighbour)) {

        let newNeighbour = {
            i: neighbour.i,
            j: neighbour.j,
            g: g,
            h: h,
            f: f,
            cameFrom: current
        }

        if (!open.includes(neighbour)) open.push(newNeighbour)
        return newNeighbour
    }

    else return 
}

const getHValue = (node, apple) => {
    let diffX = apple[0] - node.i;
    let diffY = apple[1] - node.j;
    
    return Math.sqrt(Math.pow(diffX,2) + Math.pow(diffY,2));
}

const findPath = () => {

}

module.exports = { aStar }