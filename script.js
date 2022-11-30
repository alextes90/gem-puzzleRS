//creating main container
let mainContainer = document.createElement("div");
let puzzleContainer = document.createElement("div");
let restartButton = document.createElement("button");
let setsWrapper = document.createElement("div");
let movementsTime = document.createElement("div");
let movements = document.createElement("span");
let time = document.createElement("span");
let sizes = document.createElement("div");
let sound = document.createElement("div");
let saveButton = document.createElement("button");
let winningLayout = document.createElement("div");
let winningText = document.createElement("div");
let resultsButton = document.createElement("button");
let resultsLayout = document.createElement("div");
let resultsText = document.createElement("div");

//add styles
mainContainer.classList.add("main-container");
puzzleContainer.classList.add("puzzle-container");
setsWrapper.classList.add("sets-wrapper");
restartButton.classList.add("button");
saveButton.classList.add("button");
movementsTime.classList.add("movements-time");
sizes.classList.add("sizes");
sound.classList.add("sound");
winningLayout.classList.add("hidden");
winningLayout.classList.add("winning-layout");
winningText.classList.add("winning-text");
resultsButton.classList.add("button");
resultsLayout.classList.add("winning-layout");
resultsLayout.classList.add("hidden");
resultsText.classList.add("results-text");

//add elements to the body
document.body.append(winningLayout);
document.body.append(resultsLayout);
document.body.append(mainContainer);
mainContainer.append(setsWrapper);
winningLayout.append(winningText);
resultsLayout.append(resultsText);
setsWrapper.append(restartButton);
setsWrapper.append(saveButton);
setsWrapper.append(resultsButton);
setsWrapper.append(sound);
mainContainer.append(movementsTime);
mainContainer.append(puzzleContainer);
mainContainer.append(sizes);
movementsTime.append(movements);
movementsTime.append(time);

//creating puzzle field
let puzzle = [];
let size = 4;
let itemSize = 80;
let numMovies = 0;
let seconds = 0;
let minutes = 0;
let soundMusic = true;
let savePosition = true;
let bestResultsArr = [];

let emptyPuzzle = document.querySelector(".empty-puzzle");

//calling function

generatePuzzle();
randomizePuzzle(puzzle);
renderPuzzle();
moveItem(puzzle, size);
dragAndDrop();

puzzleContainer.style.height = `${size * itemSize}px`;
puzzleContainer.style.width = `${size * itemSize}px`;
//give the position to items as in matrix (row and column)

function getRow(pos) {
    return Math.ceil(pos / size);
}

function getCol(pos) {
    let col = pos % size;
    if (col === 0) {
        col = size;
    }
    return col;
}

function generatePuzzle() {
    for (let i = 1; i <= size * size; i++)
        puzzle.push({
            value: i,
            position: i,
            x: (getCol(i) - 1) * itemSize,
            y: (getRow(i) - 1) * itemSize,
            render: true,
        });
}

// Render Puzzle at puzzle-container and styling elements

function renderPuzzle(animat) {
    const hiddenPuzzle = puzzle.find((el) => el.value === size * size);

    hiddenPuzzle.render = false;
    for (let el of puzzle) {
        if (!el.render) {
            puzzleContainer.innerHTML += `<div class="empty-puzzle" style="height: ${
                itemSize - 3
            }px; width: ${itemSize - 3}px; left: ${el.x}px; top: ${
                el.y
            }px"></div>`;
        } else {
            puzzleContainer.innerHTML += `<div draggable='true' class="puzzle-item ${
                el.animation ? animat : "nothing"
            }" style="height: ${itemSize - 3}px; width: ${
                itemSize - 3
            }px; left: ${el.x}px; top: ${el.y}px">${el.value}</div>`;
        }
    }
    emptyPuzzle = document.querySelector(".empty-puzzle");
    emptyPuzzle.addEventListener("dragenter", function (e) {
        e.preventDefault();
        e.target.classList.add("drag-over");
    });

    emptyPuzzle.addEventListener("dragover", function (e) {
        e.preventDefault();
        e.target.classList.add("drag-over");
    });

    emptyPuzzle.addEventListener("dragleave", function (e) {
        e.target.classList.remove("drag-over");
    });

    emptyPuzzle.addEventListener("drop", function (e) {
        e.target.classList.remove("drag-over");

        const draggable = +document.querySelector(".draggable").innerText;

        const draggableItem = puzzle.find((el) => el.value === draggable);

        const emptyPuzzlePos = puzzle.find((el) => el.value === size * size);

        if (
            draggableItem.position - 1 === emptyPuzzlePos.position ||
            draggableItem.position + 1 === emptyPuzzlePos.position ||
            draggableItem.position - size === emptyPuzzlePos.position ||
            draggableItem.position + size === emptyPuzzlePos.position
        ) {
            if (
                draggableItem.position % size === 0 &&
                draggableItem.position + 1 === emptyPuzzlePos.position
            ) {
            } else {
                let temp = puzzle[draggableItem.position - 1].value;
                puzzle[draggableItem.position - 1].value =
                    puzzle[emptyPuzzlePos.position - 1].value;
                puzzle[emptyPuzzlePos.position - 1].value = temp;
                puzzle[emptyPuzzlePos.position - 1].render = true;
                winningCondition(puzzle);
                clearPuzzle();
                renderPuzzle();
                numMovies += 1;
                movements.innerText = `Moves: ${numMovies}`;
                //adding sound to movement
                if (soundMusic) {
                    let sound = new Audio(
                        "./assets/sounds/src_assets_sounds_move.mp3"
                    );
                    sound.play();
                }
            }
        } else {
            clearPuzzle();
            renderPuzzle();
        }
    });
}

restartButton.innerText = "restart";
saveButton.innerText = "save";
resultsButton.innerText = "results";
movements.innerText = `Moves: ${numMovies}`;
time.innerText = `Time: 0${minutes} : 0${seconds}`;

//add restart button

function restartGame(arr) {
    puzzle = [];
    numMovies = 0;
    movements.innerText = `Moves: ${numMovies}`;
    seconds = 0;
    minutes = 0;
    time.innerText = `Time: 0${minutes} : 0${seconds}`;
    clearPuzzle();
    generatePuzzle();
    shuffle(puzzle);
    randomizePuzzle(puzzle);
    renderPuzzle();
    moveItem(puzzle, size);
}

restartButton.addEventListener("click", restartGame);

//Getting the random numberArr and randomizingPuzzle and hide the last one

function shuffle(arr) {
    const hellperArr = [];
    for (let el of arr) {
        hellperArr.push(el.value);
    }
    for (let i = 0; i < hellperArr.length; i++) {
        let temp = Math.floor(Math.random() * (i + 1));
        let currItem = hellperArr[i];
        hellperArr[i] = hellperArr[temp];
        hellperArr[temp] = currItem;
    }

    while (!checkingSolvability(hellperArr)) {
        for (let i = 0; i < hellperArr.length; i++) {
            let temp = Math.floor(Math.random() * (i + 1));
            let currItem = hellperArr[i];
            hellperArr[i] = hellperArr[temp];
            hellperArr[temp] = currItem;
        }
    }

    return hellperArr;
}

function randomizePuzzle(puzzle) {
    const randomValues = shuffle(puzzle);
    for (let i = 0; i < puzzle.length; i++) {
        puzzle[i].value = randomValues[i];
    }
}

//move the items

function moveItem(puzzle, size) {
    const puzzleContainer = document.querySelector(".puzzle-container");
    let animationVariant = "";
    puzzleContainer.addEventListener("click", function (e) {
        const item = e.target.closest(".puzzle-item");
        if (!item) {
            return;
        }

        const clickedItem = puzzle.find((el) => el.value === +item.innerText);
        const hiddenItem = puzzle.find((el) => el.value === size * size);
        if (
            clickedItem.position - 1 === hiddenItem.position ||
            clickedItem.position + 1 === hiddenItem.position ||
            clickedItem.position - size === hiddenItem.position ||
            clickedItem.position + size === hiddenItem.position
        ) {
            if (
                clickedItem.position % size === 0 &&
                clickedItem.position + 1 === hiddenItem.position
            ) {
            } else {
                let temp = puzzle[clickedItem.position - 1].value;
                puzzle[clickedItem.position - 1].value =
                    puzzle[hiddenItem.position - 1].value;
                puzzle[hiddenItem.position - 1].value = temp;
                puzzle[hiddenItem.position - 1].render = true;
                //clear the field and render one more time
                clearPuzzle();

                if (clickedItem.position - 1 === hiddenItem.position) {
                    animationVariant = "animation-left";
                    puzzle[clickedItem.position - 2].animation = true;
                }
                if (clickedItem.position + 1 === hiddenItem.position) {
                    animationVariant = "animation-right";
                    puzzle[clickedItem.position].animation = true;
                }
                if (clickedItem.position - size === hiddenItem.position) {
                    animationVariant = "animation-up";
                    puzzle[clickedItem.position - size - 1].animation = true;
                }
                if (clickedItem.position + size === hiddenItem.position) {
                    animationVariant = "animation-down";
                    puzzle[clickedItem.position + size - 1].animation = true;
                }

                renderPuzzle(animationVariant);

                for (let el of puzzle) {
                    el.animation = false;
                }

                numMovies += 1;
                movements.innerText = `Moves: ${numMovies}`;
                //adding sound to movement
                if (soundMusic) {
                    let sound = new Audio(
                        "./assets/sounds/src_assets_sounds_move.mp3"
                    );
                    sound.play();
                }
                winningCondition(puzzle);
            }
        }
    });
}

function clearPuzzle() {
    puzzleContainer.innerHTML = "";
}

//adding timer

setInterval(() => {
    seconds++;
    let displaySeconds = seconds < 10 ? "0" + seconds : seconds;
    let displayMinutes = minutes < 10 ? "0" + minutes : minutes;
    if (displaySeconds >= 59) {
        seconds = 0;
        minutes++;
    }

    time.innerText = `Time: ${displayMinutes} : ${displaySeconds}`;
}, 1000);

//different sizes. Create as button. On click rerender the page with new sizes

const sizeButtonArr = [];
for (let i = 3; i < 9; i++) {
    sizeButtonArr.push(`${i}`);
    sizeButtonArr[i - 3] = document.createElement("button");
    sizeButtonArr[i - 3].classList.add("button-size");
    sizeButtonArr[i - 3].innerText = `${i}x${i}`;
    sizes.append(sizeButtonArr[i - 3]);
}

sizes.addEventListener("click", function (e) {
    const item = e.target.closest(".button-size");
    if (!item) {
        return;
    }
    const value = +item.innerText[0];
    if (value > 4) {
        itemSize = 40;
    } else {
        itemSize = 80;
    }
    size = value;
    restartGame();
    puzzleContainer.style.height = `${size * itemSize}px`;
    puzzleContainer.style.width = `${size * itemSize}px`;
});

//function to turn on and off sound
sound.addEventListener("click", function () {
    if (soundMusic) {
        soundMusic = false;
        sound.classList.remove("sound");
        sound.classList.add("sound-off");
    } else {
        soundMusic = true;
        sound.classList.add("sound");
        sound.classList.remove("sound-off");
    }
});

//Save current position to LocalStorage

saveButton.addEventListener("click", function () {
    if (savePosition) {
        let savedGame = {
            size: size,
            itemSize: itemSize,
            gameField: puzzle,
            seconds: seconds,
            minutes: minutes,
            numMovies: numMovies,
        };
        localStorage.setItem("gemPuzzle", JSON.stringify(savedGame));
        savePosition = false;
        saveButton.innerText = "load";
    } else {
        let loadGame = JSON.parse(localStorage.getItem("gemPuzzle"));

        size = loadGame.size;
        itemSize = loadGame.itemSize;
        puzzle = loadGame.gameField;
        seconds = loadGame.seconds;
        minutes = loadGame.minutes;
        numMovies = loadGame.numMovies;

        clearPuzzle();
        renderPuzzle();
        moveItem(puzzle, size);

        puzzleContainer.style.height = `${size * itemSize}px`;
        puzzleContainer.style.width = `${size * itemSize}px`;
        movements.innerText = `Moves: ${numMovies}`;
        time.innerText = `Time: 0${minutes} : 0${seconds}`;

        localStorage.removeItem("gemPuzzle");
        savePosition = true;
        saveButton.innerText = "save";
    }
});

//adding data after loading the page

window.addEventListener("load", function () {
    if (this.localStorage.gemPuzzle) {
        savePosition = false;
        saveButton.innerText = "load";
    }

    bestResultsArr = JSON.parse(this.localStorage.getItem("BestResults"))
        ? JSON.parse(this.localStorage.getItem("BestResults"))
        : [];

    bestResultsArr?.sort((a, b) => a.numMovies - b.numMovies);
    bestResultsArr?.splice(10, bestResultsArr.length);
});

//adding winning statement
function winningCondition(puzzle) {
    let checker = 0;
    for (let i = 0; i < puzzle.length - 1; i++) {
        if (puzzle[i].value > puzzle[i + 1].value) {
            checker++;
        }
    }

    if (!checker) {
        winningText.innerText = `Hooray! You solved the puzzle in ${minutes} : ${seconds}s and ${numMovies} moves`;
        winningLayout.classList.remove("hidden");

        const playerName = prompt("What is your name");
        let winningGame = {
            player: playerName,
            seconds: seconds,
            minutes: minutes,
            numMovies: numMovies,
        };

        bestResultsArr.push(winningGame);

        localStorage.setItem(`BestResults`, JSON.stringify(bestResultsArr));
    }
}

winningLayout.addEventListener("click", function (e) {
    let modal = e.target.closest(".winning-text");
    if (modal) {
        return;
    }

    winningLayout.classList.add("hidden");
    location.reload();
});

resultsLayout.addEventListener("click", function (e) {
    let modal = e.target.closest(".winning-text");
    if (modal) {
        return;
    }

    resultsLayout.classList.add("hidden");
});

//checking is solvable
function checkingSolvability(arr1) {
    let arr = [];
    for (let el of arr1) {
        if (el === size * size) {
            continue;
        }
        arr.push(el);
    }
    let countIversition = 0;
    for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[i] > arr[j]) {
                countIversition++;
            }
        }
    }

    let rowX = Math.ceil((arr1.indexOf(size * size) + 1) / size);

    if (size % 2 !== 0) {
        return countIversition % 2 === 0 ? true : false;
    }
    if ((rowX + countIversition) % 2 !== 0) {
        return false;
    }

    return true;
}

//rendering results by clicking results button

resultsButton.addEventListener("click", function () {
    resultsLayout.classList.remove("hidden");
    resultsText.innerText = "";
    for (let el of bestResultsArr) {
        resultsText.innerText += `${el.player} -- ${el.numMovies}th mov. -- Time: ${el.minutes} : ${el.seconds}\n`;
    }
});

//Adding drag and Drop functionality

function dragAndDrop() {
    puzzleContainer.addEventListener("dragstart", function (e) {
        let el = e.target.closest(".puzzle-item");
        if (!el) {
            return;
        }
        setTimeout(() => {
            el.classList.add("draggable");
        }, 0);
    });
}
