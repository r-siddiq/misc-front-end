let randomNumber;
let attempts = 0;
let wins = 0;
let losses = 0;

initializeGame();

function initializeGame() {
    randomNumber = Math.floor(Math.random() * 99) + 1;
    console.log("randomNumber: " + randomNumber);
    attempts = 0;

    document.querySelector("#resetBtn").style.display = "none";
    document.querySelector("#guessBtn").style.display = "inline";

    document.querySelector("#playerGuess").focus();
    document.querySelector("#playerGuess").value = "";
    document.querySelector("#feedback").textContent = "";
    document.querySelector("#guesses").textContent = "";
    document.querySelector("#attemptsLeft").textContent = 7;
}

document.querySelector("#guessBtn").addEventListener("click", checkGuess);
document.querySelector("#resetBtn").addEventListener("click", initializeGame);

function checkGuess() {
    let feedback = document.querySelector("#feedback");
    feedback.textContent = "";
    let guess = document.querySelector("#playerGuess").value;
    console.log("Player guess: " + guess);

    if (guess < 1 || guess > 99) {
        feedback.textContent = "Please enter a number between 1 and 99";
        feedback.style.color = "red";
        return;
    }

    attempts++;
    document.querySelector("#attemptsLeft").textContent = 7 - attempts;

    if (guess == randomNumber) {
        feedback.textContent = "You guessed it! You Won!";
        feedback.style.color = "darkgreen";
        wins++;
        document.querySelector("#wins").textContent = wins;
        gameOver();
    } else {
        document.querySelector("#guesses").textContent += guess + " ";

        if (attempts == 7) {
            feedback.textContent = "Sorry, you lost!" + " The number was " + randomNumber;
            feedback.style.color = "red";
            losses++;
            document.querySelector("#losses").textContent = losses;
            gameOver();
        } else if (guess > randomNumber) {
            feedback.textContent = "Guess was high";
        } else {
            feedback.textContent = "Guess was low";
        }
    }
}

function gameOver() {
    document.querySelector("#guessBtn").style.display = "none";
    document.querySelector("#resetBtn").style.display = "inline";
}
