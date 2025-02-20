document.addEventListener("DOMContentLoaded", () => {
    const startScreen = document.getElementById("start-screen");
    const gameContainer = document.getElementById("game-container");
    const player1Input = document.getElementById("player1-name");
    const player2Input = document.getElementById("player2-name");
    const playerColorInput = document.getElementById("player-color");
    const startButton = document.getElementById("start-btn");
    const currentPlayerDisplay = document.getElementById("current-player");
    const gameBoard = document.getElementById("game-board");
    const score1Display = document.getElementById("score1");
    const score2Display = document.getElementById("score2");
    const helpButton = document.getElementById("help-btn");
    const restartButton = document.getElementById("restart-btn");
    const helpMessage = document.getElementById("help-message");
    const gameMode = document.getElementById("game-mode");

    let player1, player2;
    let currentPlayer;
    let isSinglePlayer = true;
    let score1 = 0, score2 = 0;
    let firstCard = null, secondCard = null;
    let lockBoard = false;
    let timer;
    let timeLeft = 60;

    const icons = ["🍎", "🍌", "🍉", "🍓", "🍒", "🍍", "🥝", "🥕"];
    let cards = [...icons, ...icons];

    function shuffleCards() {
        for (let i = cards.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [cards[i], cards[j]] = [cards[j], cards[i]];
        }

    }

    function createCards() {
        gameBoard.innerHTML = "";
        shuffleCards();
        cards.forEach(icon  => {
            const card = document.createElement("div");
            card.classList.add("card");
            card.dataset.icon = icon;
            card.innerHTML = "?";
            card.addEventListener("click", flipCard);
            gameBoard.appendChild(card);
        });
    }

    function flipCard() {
        if (lockBoard || this == firstCard) return;

        this.classList.add("flipped");
        this.innerHTML = this.dataset.icon;

        if (!firstCard) {
            firstCard = this;
            return;
        }
        secondCard = this;
        lockBoard = true;
        checkForMatch();
    }

    function checkForMatch() {
        if (firstCard.dataset.icon === secondCard.dataset.icon) {
            disableCards();
            updateScore();
        } else {
            setTimeout(unflipCards, 1000);
        }
    }
    function resetBoard() {
        firstCard = null;
        secondCard = null;
        lockBoard = false;
    }

    function disableCards() {
        firstCard.removeEventListener("click", flipCard);
        secondCard.removeEventListener("click", flipCard);
        resetBoard();
        checkGameOver();
    }

    function unflipCards() {
        firstCard.innerHTML = "?";
        secondCard.innerHTML = "?";
        firstCard.classList.remove("flipped");
        secondCard.classList.remove("flipped");
        resetBoard();
        if (!isSinglePlayer) switchPlayer();
    }

    function updateScore() {
        if (currentPlayer === player1) {
            score1 += 10;
            score1Display.textContent = score1;
        } else {
            score2 += 10;
            score2Display.textContent = score2;
        }
    }

    function switchPlayer() {
        currentPlayer = (currentPlayer === player1) ? player2 : player1;
        currentPlayerDisplay.textContent = `${currentPlayer}`;
    }

    function checkGameOver() {
        if (document.querySelectorAll(".card.flipped").length === cards.length) {
            setTimeout(() => {
                clearInterval(timer);
                if (isSinglePlayer) {
                    alert(`🎉 Game Over! You scored ${score1} points!`);
                } else {
                    let winner = score1 > score2 ? player1 : (score1 < score2 ? player2 : "It's a tie!");
                    alert(`🏆 Game Over! ${winner} wins!`);
                }
                restartGame();
            }, 500);

        }

    }
    function restartGame() {
        score1 = 0;
        score2 = 0;
        score1Display.textContent = score1;
        score2Display.textContent = score2;
        currentPlayer = player1;
        currentPlayerDisplay.textContent = `${currentPlayer}'s Turn`; 
        createCards();
    

        if (!isSinglePlayer) {
            startTimer();
    }
}

    startButton.addEventListener("click", () => {
        if (!player1Input.value.trim()) {
            alert("Enter Player 1 Name!");
            return;
        }

        player1 = player1Input.value;
        player2 = player2Input.value || "Computer";
        currentPlayer = player1;

        isSinglePlayer = gameMode.value === "single";
        if (isSinglePlayer) {
            player2Input.style.display = "none";
        } else {
            if (!player2Input.value.trim()) {
                alert("Enter a player name!");
                return;
            }
            player2Input.style.display = "block";
        }

        const selectedColor = playerColorInput.value;
        document.body.style.backgroundColor = selectedColor;

        startScreen.style.display = "none";
        gameContainer.style.display = "block";
        currentPlayerDisplay.textContent = `${currentPlayer}'s Turn`;
        createCards();

        if (isSinglePlayer) {
            startTimer();
        }
    });
    restartButton.addEventListener("click", restartGame);
    helpButton.addEventListener("click", () => {
        helpMessage.style.display = helpMessage.style.display === "none" || helpMessage.style.display === ""
            ? "block"
            : "none";
    });


   

    function startTimer() {
        clearInterval(timer);
        timeLeft = 60;
        document.getElementById("timer").textContent = timeLeft;
        timer = setInterval(() => {
            timeLeft--;
            document.getElementById("timer").textContent = timeLeft;

            if (timeLeft <= 0) {
                clearInterval(timer);
                alert(`⏳ Time's up! You scored ${score1} points.`);
                restartGame();
            }
        }, 1000);
    }
});



