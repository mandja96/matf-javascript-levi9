//##########################################
// SOUND object

function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }    
}
const soundWin = new sound("../sound/soundWin.mp3");

//##########################################

const maze = new Maze(16, 16, 20);
let username = "";

// MAZE object, sve je zapravo funkcija u JavaScript
function Maze(rows, 
              cols, 
              time_limit) {

    this.TIME_LIMIT = time_limit;
    this.MAX_COLS = rows;
    this.MAX_ROWS = cols;
    this.numOfMoves = 0;
    this.soundOn = false;
    this.gameOn = false;

    this.matrix = [];
    for (let i=0; i<2*this.MAX_ROWS-1; i++) {
        this.matrix[i] = [];
        for (let j=0; j<2*this.MAX_COLS-1; j++) {
            this.matrix[i][j] = 0;
        }
    }
    let checkbox = document.getElementById("sound");
    checkbox.addEventListener('change', e => {
        if(e.target.checked){
            this.soundOn = true;
        }
        else{
            this.soundOn = false;
        }
        console.log(this.soundOn);
    });

    this.initializeMaze = () => {
        let innerHTMLString = "";
        innerHTMLString = '<table>';
        for (let the_row = 1; the_row <= this.MAX_ROWS; the_row++) {
            innerHTMLString += '<tr>';
            for (let the_col = 1; the_col <= this.MAX_COLS; the_col++) 
                innerHTMLString += '<td id=\"r' + the_row + 'c' + the_col + '\"</td>';
            innerHTMLString += '</tr>';
        }
        innerHTMLString += '</table>';
    
        document.getElementById("maze_grid").innerHTML = innerHTMLString;
        this.generateMaze();
        generateState();
    };

    this.timerStarted = false;
    this.timer = 0;
    this.currentTimer = 0;

    this.previousState = {
        i : 1,
        j : 1
    }
    this.currentState = {
        i : 1,
        j : 1
    }
    this.endState = {
        i : this.MAX_ROWS,
        j : 1
    }

    this.generateMaze = () => {
        for (let the_row = 1; the_row <= this.MAX_ROWS; the_row++) {
            for (let the_col = 1; the_col <= this.MAX_COLS; the_col++) {
                
                let cell = 'r' + the_row + 'c' + the_col;
            
                if (the_row === 1) {
                    if (the_col === this.MAX_COLS)
                        continue;
                    document.getElementById(cell).style.borderRightStyle = "hidden";
                    this.matrix[2*the_row-2][2*the_col-2] = 1;
                    this.matrix[2*the_row-2][2*the_col-1] = 1;
                    this.matrix[2*the_row-2][2*the_col] = 1;
                }
                else if (the_col === this.MAX_COLS) {
                    document.getElementById(cell).style.borderTopStyle = "hidden";
                    this.matrix[2*the_row-3][2*the_col-2] = 1;
                    this.matrix[2*the_row-2][2*the_col-2] = 1;
                }
                else {
                    if (Math.random() >= 0.5) {                    
                        document.getElementById(cell).style.borderTopStyle = "hidden";
                        this.matrix[2*the_row-4][2*the_col-2] = 1;
                        this.matrix[2*the_row-3][2*the_col-2] = 1;
                        this.matrix[2*the_row-2][2*the_col-2] = 1;

                    } else {
                        document.getElementById(cell).style.borderRightStyle = "hidden";
                        this.matrix[2*the_row-2][2*the_col-2] = 1;
                        this.matrix[2*the_row-2][2*the_col-1] = 1;
                        this.matrix[2*the_row-2][2*the_col] = 1;
                    }
                }
            }
        }

        // START
        document.getElementById("r1c1").style.borderLeftStyle = "hidden";
        let end = 'r' + this.MAX_ROWS + 'c' + 1;

        // FINISH
        document.getElementById(end).style.borderLeftStyle = "hidden"; 
    };

    this.startMaze = async () => {
        username = document.getElementById("username").value;

        if (!this.timerStarted && username.length > 0 && !this.gameOn) {
            this.timerStarted = true;
            this.gameOn = true;
            this.timer = window.setInterval( async () => {
                this.currentTimer++;

                document.getElementById('timer')
                    .innerText = 'Timer status: ' + this.currentTimer;

                if (this.currentTimer === this.TIME_LIMIT) {
                    this.gameOn = false;
                    alert(" GAME OVER\n" + " Number of moves: " + this.numOfMoves); 
                    await sendResult(username, Number.MAX_VALUE);
                    clearInterval(this.timer);
                    getResult();                    
                    // document.location.reload();
                }
            }, 1000)

            username = document.getElementById("username").value;
            document.getElementById("username").disabled = true;    
            console.log(username);

            this.initializeMaze();
        }
    };

    this.resetMaze = () => {
        document.location.reload();
    };
}

const generateState = () => {
    let nameID = 'r' + maze.currentState.i + 'c' + maze.currentState.j;
    let cell = document.getElementById(nameID);
    let divPointer = document.createElement('div');
    divPointer.id = "pointer";
    divPointer.textContent = "x";

    cell.appendChild(divPointer);
    divPointer.style.backgroundColor = "rgb(54, 138, 21)";

    setTimeout(function() {
        checkFinish();
    }, 0)
};

window.addEventListener("keydown", event => {
    console.log(maze.gameOn);
    
    if (event.key === 'a' && maze.gameOn) {
        if(maze.currentState.j === 1){
            console.log("Ne mozes levo!");
        }
        else{
            if (maze.matrix[2*maze.currentState.i-2][2*maze.currentState.j-3] === 1){ 
                maze.numOfMoves++;
                maze.previousState.i = maze.currentState.i;
                maze.previousState.j = maze.currentState.j;
                maze.currentState.i = maze.previousState.i;
                maze.currentState.j = maze.previousState.j - 1;

                let id = "pointer";
                document.getElementById(id).remove();
                generateState();
            }
        }
    }
});

window.addEventListener("keydown", event => {
    if (event.key === 'w' && maze.gameOn) {
        if(maze.currentState.i === 1){
            console.log("Ne mozes gore!");
        }
        else{
            if(maze.matrix[2*maze.currentState.i-3][2*maze.currentState.j-2] === 1){
                maze.numOfMoves++;
                maze.previousState.i = maze.currentState.i;
                maze.previousState.j = maze.currentState.j;
                maze.currentState.i = maze.previousState.i - 1;
                maze.currentState.j = maze.previousState.j;

                let id = "pointer";
                document.getElementById(id).remove();
                generateState();
            }   
        }
    }
});

window.addEventListener("keydown", event => {
    if (event.key === 'd' && maze.gameOn) {
        if(maze.currentState.j === maze.MAX_COLS){
            console.log("Ne mozes desno!");
        }
        else{
            if(maze.matrix[2*maze.currentState.i-2][2*maze.currentState.j-2+1] === 1){
                maze.numOfMoves++;
                maze.previousState.i = maze.currentState.i;
                maze.previousState.j = maze.currentState.j;
                maze.currentState.i = maze.previousState.i;
                maze.currentState.j = maze.previousState.j + 1;

                let id = "pointer";
                document.getElementById(id).remove();
                generateState();
            }
        }
    }
});

window.addEventListener("keydown", event => {
    if (event.key === 's' && maze.gameOn) {
        if(maze.currentState.i === maze.MAX_ROWS){
            console.log("Ne mozes dole!");
        }
        else{
            if(maze.matrix[2*maze.currentState.i-2+1][2*maze.currentState.j-2] === 1){
                maze.numOfMoves++;
                maze.previousState.i = maze.currentState.i;
                maze.previousState.j = maze.currentState.j;
                maze.currentState.i = maze.previousState.i+1;
                maze.currentState.j = maze.previousState.j;

                let id = "pointer";
                document.getElementById(id).remove();
                generateState();
            }    
        }
    }
});

const checkFinish = async () => {
    if (maze.currentState.i === maze.endState.i && maze.currentState.j === maze.endState.j){
        if(maze.soundOn){
            soundWin.play();
        }
        alert(" Yaaay! You mazed it :)\n" + " Total moves: " + maze.numOfMoves + "\n" 
            + " Total seconds: " + maze.currentTimer);

        maze.gameOn = false;
        clearInterval(maze.timer);

        let result = 4*maze.currentTimer + maze.numOfMoves;
        await sendResult(username, result);
        getResult();
        // document.location.reload();
    }
}

// #######################################

const sendResult = async (username, result) => {
    try { 
        const URL = 'http://localhost:3000/';
        const response = await fetch(URL, {
            method : 'POST',
            headers : {
                'Content-Type': 'application/json'
            },
            mode : 'cors',
            body : JSON.stringify({
                name : username,
                score : result
            })
        });
        const jsonResponse = await response.json();
        console.log(jsonResponse);
        
    } catch (err) {
        console.error(err);
    }
}

const getResult = async () => {
    try {
        const URL = 'http://localhost:3000/';
        const response = await fetch(URL, {
            method : 'GET',
            headers : {
                'Content-Type': 'application/json'
            }
        });
        const jsonResponse = await response.json();
        console.log(jsonResponse);   
             
    } catch (err) {
        console.log(err);
    }
}