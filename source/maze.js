//##########################################
// INITIALIZATION
const TIME_LIMIT = 10
const MAX_COLS = 17
const MAX_ROWS = 17

var timerStarted = false
var timer
var currentTimer = 0

var numOfMoves = 0

var matrix = []

for (var i=0; i<2*MAX_ROWS-1; i++) {
    matrix[i] = []
    for (var j=0; j<2*MAX_COLS-1; j++) {
        matrix[i][j] = 0
    }
}

var previousState = {
    i : 1,
    j : 1
}
var currentState = {
    i : 1,
    j : 1
}
var endState = {
    i : MAX_ROWS,
    j : 1
}
//##########################################

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
    generateState()
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

    // START
    document.getElementById("r1c1").style.borderLeftStyle = "hidden" 
    var end = 'r' + MAX_ROWS + 'c' + 1

    // FINISH
    document.getElementById(end).style.borderLeftStyle = "hidden" 
};

const startMaze = () => {
    if (!timerStarted) {
        timerStarted = true
        timer = window.setInterval(() => {
            currentTimer++

            document.getElementById('timer')
                .innerText = 'Timer status: ' + currentTimer

            if (currentTimer === TIME_LIMIT) {
                alert(" GAME OVER\n" + " Number of moves: " + numOfMoves); 
                clearInterval(timer)
            }
        }, 1000)
        initializeMaze()
    }
};

const resetMaze = () => {
    document.location.reload()
};

const generateState = () => {
    let nameID = 'r' + currentState.i + 'c' + currentState.j
    var cell = document.getElementById(nameID)
    var divPointer = document.createElement('div')
    divPointer.id = "pointer"
    divPointer.textContent = "x"

    cell.appendChild(divPointer)
    divPointer.style.backgroundColor = "rgb(54, 138, 21)"
    checkFinish()
};

window.addEventListener("keydown", event => {
    if (event.key == "c") {
      document.body.style.background = "white";
    }
  });
window.addEventListener("keyup", event => {
    if (event.key == "c") {
        document.body.style.background = "";
    }
});

  // left = 37, up = 38, right = 39, down = 40
  // a, w, d, s
window.addEventListener("keydown", event => {
    if (event.key == 'a') {
        if(currentState.j == 1){
            console.log("Ne mozes levo!")
        }
        else{
            if (matrix[2*currentState.i-2][2*currentState.j-3] == 1){ 
                numOfMoves++
                previousState.i = currentState.i
                previousState.j = currentState.j
                currentState.i = previousState.i
                currentState.j = previousState.j - 1

                let id = "pointer"
                document.getElementById(id).remove()
                generateState()
            }
        }
    }
});
window.addEventListener("keydown", event => {
    if (event.key == 'w') {
        if(currentState.i == 1){
            console.log("Ne mozes gore!")
        }
        else{
            if(matrix[2*currentState.i-3][2*currentState.j-2] == 1){
                numOfMoves++
                previousState.i = currentState.i
                previousState.j = currentState.j
                currentState.i = previousState.i - 1
                currentState.j = previousState.j

                let id = "pointer"
                document.getElementById(id).remove()
                generateState()
            }
        }
    }
  });
window.addEventListener("keydown", event => {
    if (event.key == 'd') {
        if(currentState.j == MAX_COLS){
            console.log("Ne mozes desno!")
        }
        else{
            if(matrix[2*currentState.i-2][2*currentState.j-2+1] == 1){
                numOfMoves++
                previousState.i = currentState.i
                previousState.j = currentState.j
                currentState.i = previousState.i
                currentState.j = previousState.j + 1

                let id = "pointer"
                document.getElementById(id).remove()
                generateState()
            }
        }
    }
});
window.addEventListener("keydown", event => {
    if (event.key == 's') {
        if(currentState.i == MAX_ROWS){
            console.log("Ne mozes dole!")
        }
        else{
            if(matrix[2*currentState.i-2+1][2*currentState.j-2] == 1){
                numOfMoves++
                previousState.i = currentState.i
                previousState.j = currentState.j
                currentState.i = previousState.i+1
                currentState.j = previousState.j

                let id = "pointer"
                document.getElementById(id).remove()
                generateState()
            }
        }
    }
});

const checkFinish = () => {
    if (currentState.i == endState.i && currentState.j == endState.j){
        alert(" Yaaay! You mazed it :)\n" + " Total moves: " + numOfMoves + "\n" 
            + " Total seconds " + currentTimer)
        document.location.reload()
    }
}