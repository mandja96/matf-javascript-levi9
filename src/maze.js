const TIME_LIMIT = 120
const MAX_COLS = 10
const MAX_ROWS = 10

var timerStarted = false
var timer
var currentTimer = 0

var matrix = []

for (var i=0; i<2*MAX_ROWS-1; i++) {
    matrix[i] = []
    for (var j=0; j<2*MAX_COLS-1; j++) {
        matrix[i][j] = 0
    }
}

const initializeMaze = () => {

    var innerHTMLString = ""
    innerHTMLString = '<table>'
    for (var the_row = 1; the_row <= MAX_ROWS; the_row++) {
        innerHTMLString += '<tr>'
        for (var the_col = 1; the_col <= MAX_COLS; the_col++) 
            innerHTMLString += '<td id=\"r' + the_row + 'c' + the_col + '\"</td>'
        innerHTMLString += '</tr>'
    }
    innerHTMLString += '</table>'

    document.getElementById("maze_grid").innerHTML = innerHTMLString
    generateMaze()
    generateStart()
};

const generateMaze = () => {

    for (var the_row = 1; the_row <= MAX_ROWS; the_row++) {
        for (var the_col = 1; the_col <= MAX_COLS; the_col++) {
            
            var cell = 'r' + the_row + 'c' + the_col
        
            if (the_row === 1) {
                if (the_col === MAX_COLS)
                    continue
                document.getElementById(cell).style.borderRightStyle = "hidden" 
                matrix[2*the_row-2][2*the_col-2] = 1
                matrix[2*the_row-2][2*the_col-1] = 1
                matrix[2*the_row-2][2*the_col] = 1
            }
            else if (the_col === MAX_COLS) {
                document.getElementById(cell).style.borderTopStyle = "hidden"
                matrix[2*the_row-3][2*the_col-2] = 1
                matrix[2*the_row-2][2*the_col-2] = 1
            }
            else {
                if (Math.random() >= 0.5) {                    
                    document.getElementById(cell).style.borderTopStyle = "hidden"
                    matrix[2*the_row-4][2*the_col-2] = 1
                    matrix[2*the_row-3][2*the_col-2] = 1
                    matrix[2*the_row-2][2*the_col-2] = 1

                } else {
                    document.getElementById(cell).style.borderRightStyle = "hidden"
                    matrix[2*the_row-2][2*the_col-2] = 1
                    matrix[2*the_row-2][2*the_col-1] = 1
                    matrix[2*the_row-2][2*the_col] = 1
                }
            }
        }
    }
};

const startMaze = () => {
    if (!timerStarted) {
        timerStarted = true
        timer = window.setInterval(() => {
            currentTimer++

            document.getElementById('timer')
                .innerText = 'Timer status: ' + currentTimer

            if (currentTimer === TIME_LIMIT) {
                alert("GAME OVER");
                clearInterval(timer)
                document.location.reload();
            }
        }, 1000)

        initializeMaze()
    }
};

const resetMaze = () => {
    document.location.reload()
};

const generateStart = () => {
    var cell = document.getElementById('r1c1')
    var divPointer = document.createElement('div')
    divPointer.id = "pointer"
    divPointer.textContent = "You"

    cell.appendChild(divPointer)
    divPointer.style.backgroundColor = "rgb(212, 82, 6)"
};

