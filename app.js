const CELL_WIDTH = 20;
const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 500;
const ROWS = CANVAS_WIDTH / CELL_WIDTH;
const COLS = CANVAS_WIDTH / CELL_WIDTH;
class Game {
    constructor() {
        this.score = 0;

        this.canvas = document.getElementById("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.snake = new Snake(this.ctx);
        this.food = new Food(this.ctx);

        this.interval = null;
    }

    start() {
        this.snake.draw();
        this.food.draw(this.snake);
    }

    handleKeyDown(event) {
        switch (event.keyCode) {
            case 37: {
                // left
                clearInterval(this.interval);
                this.interval = setInterval(() => {
                    this.snake.move(-CELL_WIDTH, 0, this.checkCollision.bind(this));
                }, 100);

                break;
            }
            case 38: {
                clearInterval(this.interval);
                this.interval = setInterval(() => {
                    this.snake.move(0, -CELL_WIDTH, this.checkCollision.bind(this));
                }, 100)
                // up

                break;
            }
            case 39: {
                // right
                clearInterval(this.interval);
                this.interval = setInterval(() => {
                    this.snake.move(CELL_WIDTH, 0, this.checkCollision.bind(this));
                }, 100)

                break;
            }
            case 40: {
                // down
                clearInterval(this.interval);
                this.interval = setInterval(() => {
                    this.snake.move(0, CELL_WIDTH, this.checkCollision.bind(this));
                }, 100)

                break;

            }
        }

    }

    checkCollision(updatedCoords) {
        // check collision with food
        if (updatedCoords.x === this.food.x && updatedCoords.y === this.food.y) {
            // collisionwithFood = true;
            this.score += 100
            this.food.draw(this.snake);
            return true;
        }
        // check collision with walls
        if (updatedCoords.x === 0 - CELL_WIDTH || updatedCoords.x === CANVAS_WIDTH || updatedCoords.y === 0 - CELL_WIDTH || updatedCoords.y === CANVAS_HEIGHT) {
            clearInterval(this.interval);
            alert('Game Over. Score : ' + this.score);
        }
        return false;
    }
}

class Snake {
    constructor(ctx) {
        this.ctx = ctx
        this.body = [


            { x: 40, y: 0 },
            { x: 20, y: 0 },
            { x: 0, y: 0 }
        ]
    }

    draw() {
        this.body.forEach(({ x, y }) => {
            this.ctx.fillStyle = "rgba(92,230,255)";
            this.ctx.fillRect(x, y, CELL_WIDTH, CELL_WIDTH);
        })
    }

    clear() {
        this.body.forEach(({ x, y }) => {
            this.ctx.clearRect(x, y, CELL_WIDTH, CELL_WIDTH);
        })
    }

    move(dx, dy, checkCollision) {
        this.clear()
        let collisionwithFood = false
        //^ for clearing previous position 
        const updatedBody = this.body.map(({ x, y }, index) => {
            if (index === 0) {
                const updatedCoords = { x: x + dx, y: y + dy }
                //^ return { x: x + dx, y: y + dy }

                // if (updatedCoords.x === food.x && updatedCoords.y === food.y) {
                //     collisionwithFood = true;
                // } instead we're using checkCollision method
                collisionwithFood = checkCollision(updatedCoords)
                return updatedCoords;
            }
            else {
                const prevCell = this.body[index - 1]
                return {
                    x: prevCell.x,
                    y: prevCell.y
                }
            }


        })
        if (collisionwithFood) {
            updatedBody.push({ ...this.body.pop() })
        }


        this.body = [...updatedBody];
        this.draw();


    }
}

class Food {
    constructor(ctx) {
        this.ctx = ctx
        // this.position = { x: 0, y: 0 }

    }
    draw(snake) {
        let isOverlapping = false;
        let x;
        let y;

        do {
            x = Math.floor(Math.random() * (ROWS - 1)) * CELL_WIDTH
            y = Math.floor(Math.random() * (COLS - 1)) * CELL_WIDTH

            isOverlapping = snake.body.some(
                (bodyPart) => bodyPart.x === x && bodyPart.y === y
            )
        } while (isOverlapping)

        this.x = x;
        this.y = y;
        this.ctx.fillStyle = "#EF2D13";
        this.ctx.fillRect(x, y, CELL_WIDTH, CELL_WIDTH);
    }
}

document.getElementById("start").addEventListener("click", () => {
    const game = new Game();
    game.start();

    document.addEventListener("keydown", (event) => game.handleKeyDown(event))

})