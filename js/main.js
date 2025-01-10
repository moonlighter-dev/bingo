const phraseBankSelect = document.getElementById("phraseBankSelect");
const createBoardButton = document.getElementById("createBoard");
const inGameWelcome = document.getElementById("gameWelcome");
const mainSection = document.getElementById("main");
const boardSquares = document.querySelectorAll("td");
const table = document.querySelector("tbody");
const hiddenElements = document.querySelectorAll("[hidden]");
const freeSpace = document.getElementById("freeSpace");
const btnContainer = document.getElementById("btnContainer");
const coverAllBtn = document.getElementById("coverAll");
const shuffleBtn = document.getElementById("shuffle");
let coverAllMode = false;

/**
 * @typedef {Array} winningCombos
 * @description This array hosts the values that represent the squares in the table. We will access it when we querySelectAll('td') later to see whether we have a win scenario.
 */

const winningCombos = [
  [0, 1, 2, 3, 4],
  [5, 6, 7, 8, 9],
  [10, 11, 12, 13, 14],
  [15, 16, 17, 18, 19],
  [20, 21, 22, 23, 24],
  [0, 5, 10, 15, 20],
  [1, 6, 11, 16, 21],
  [2, 7, 12, 17, 22],
  [3, 8, 13, 18, 23],
  [4, 9, 14, 19, 24],
  [0, 6, 12, 18, 24],
  [4, 8, 12, 16, 20],
  [0, 4, 12, 20, 24]
];

// Function Declarations

/**
 * @typedef {function} createBoard
 * @description Creates the game board by selecting random phrases from the phrase bank, assigning them to DOM Elements, displaying the board in the DOM, and removing the Create Game button.
 */

function createBoard() {
  btnContainer.style.margin = 0;

  let boardPhrases = [];
  let currentPhraseBank = [];
  let currentWelcome = "";

  const selectedBank = phraseBankSelect.options[phraseBankSelect.selectedIndex].value;
  console.log("Using this phrasebank: " + selectedBank)

  switch (selectedBank) {
    case "dos":
      currentPhraseBank = [...dos]
      currentWelcome = dosGameWelcome
      break;
    case "robertisms":
      currentPhraseBank = [...robertisms]
      currentWelcome = robertismsWelcome
      break;
    default:
      console.warn("No valid phrase bank selected");
      return;
  }

  inGameWelcome.innerText = currentWelcome;

  for (let i = 0; i < 25; i++) {
    if (i === 12) {
      // index 12 is my free space which I want blank
      boardPhrases.push("");
    } else {
      /**
       * @typedef {Variable} randomPhrase
       * @description This variable changes with every loop and selects a value at a random index of phraseBank.
       */

      if (currentPhraseBank.length < 24) {
        console.warn("Not enough phrases for Bingo!")
        return 
      }

      const randomPhrase =
        currentPhraseBank[Math.floor(Math.random() * currentPhraseBank.length)];

      if (!boardPhrases.includes(randomPhrase)) {
        boardPhrases.push(randomPhrase);
      } else {
        /**
         * @description i is subtracted here when a repeat is found. Since i will get a ++ to my index at the end of the current iteration, it evens out and makes the loop repeat the same value of i until it finds a phrase that hasn't been used yet. e.g, if I am on index 5, and the boardPhrases array already includes randomPhrase, i-- will reduce index to 4, then the natural iteration of the loop will bump my index back up to 5 before it checks conditions again. That will continue until an unused randomPhrase is selected. */

        i--;
      }
    }
  }

  for (let i = 0; i < 25; i++) {
    if (boardSquares[i].classList.contains("stamp")){
      if (i != 12){
        boardSquares[i].classList.remove("stamp");
      }
    }
    boardSquares[i].innerHTML = boardPhrases.shift();
  }
  hiddenElements.forEach((element) => (element.hidden = false));

}

function winningCondition() {
  if (!coverAllMode) {
    winningCombos.forEach((combo) => {
      const stamped = combo.filter((squareIndex) => {
        return boardSquares[squareIndex].className === "stamp";
      });

      if (stamped[4]) {
        victory();
      }
    });
  } else {
    const stamped = [...boardSquares].filter((square) => {
      return square.className === "stamp";
    });
    if (stamped[24]) {
      victory();
    }
  }
}

function victory() {
  freeSpace.className = "victory";
  setTimeout(() => {
    freeSpace.innerHTML = `
    <img src="/img/spirit-logo-purple-rgb.png">
    <span>
  YOU WIN! 😃 
  🎉🎉🎉
  </span>`;
  }, 300);
}

// Event Listeners

createBoardButton.addEventListener("click", createBoard)

/**
 * @listens table.addEventListener()
 * @description  setting an event listener on my whole table allows my clicks to be registered for all my squares, but also all non-square elements of my table like borders and headers. This is due to a process called event bubbling, i.e. what event happens to a child element also happens to a parent element. By setting a conditional inside the event listener, I've created an environment where only clicks of squares are accepted, but I don't have to write an event listener for every square. */

table.addEventListener("click", (event) => {
  if (event.target.tagName == "TD" && event.target != freeSpace) {
    event.target.classList.toggle("stamp");

    /**
     * @typedef {Async} setTimeout(winningCondition, 600)
     *
     * @description This 1s delay on winningCondition is necessary due to overlapping CSS animations. Without it, the stamp and victory animations running simultaneously will result in clipping.
     */

    setTimeout(winningCondition, 600);
  } else if (event.target.className === "victory") {
    event.target.innerHTML = "";
    event.target.className = "stamp";
  }
});

coverAllBtn.addEventListener("click", (event) => {
  if (event.target.className === "coverAllOn") {
    coverAllMode = false;
    event.target.className = "";
    event.target.textContent = "Cover-all Mode: Off";
    freeSpace.innerHTML = "";
    winningCondition();
  } else {
    coverAllMode = true;
    event.target.className = "coverAllOn";
    event.target.textContent = "Cover-all Mode: On";
    freeSpace.innerHTML = "";
    freeSpace.className = "stamp";
  }
});
