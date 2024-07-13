const wordGrid = document.getElementById('word-grid');
const guessInput = document.getElementById('guess-input');
const feedback = document.getElementById('feedback');
const playAgainButton = document.getElementById('play-again');

// Daftar nama pemain bola untuk ditebak, maksimal 8 karakter
const playerNames = [
    "MESSI", "RONALDO", "NEYMAR", "HAALAND", "MBAPPE", 
    "SALAH", "MODRIC", "KANE", "KIMMICH", "FIRMINO", 
    "GREALISH", "ALISSON", "JOTA", "ISCO", "PJANIC", 
    "PEPE", "MILNER", "BENZEMA", "CHIESA", "DYBALA", 
    "FODEN", "SON", "SUAREZ", "CAVANI", "DEGEA", 
    "RAKITIC", "MORATA", "WERNER", "BERNARDO", "HAZARD"
];

let correctWord = getRandomWord(playerNames); // kata yang harus ditebak
const maxAttempts = 6;
let attempts = 0;

// Set maxlength dari input berdasarkan panjang kata yang dipilih
guessInput.maxLength = correctWord.length;

// Inisialisasi grid kosong saat halaman dimuat
initializeGrid(correctWord.length);

guessInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        submitGuess();
    }
});

function submitGuess() {
    const currentGuess = guessInput.value.toUpperCase();
    if (currentGuess.length !== correctWord.length) {
        feedback.textContent = `Guess must be ${correctWord.length} letters`;
        return;
    }

    attempts++;
    feedback.textContent = "";
    guessInput.value = "";

    updateGrid(currentGuess);

    if (currentGuess === correctWord) {
        const message = `Selamat! Kamu telah menebak kata dalam ${attempts} percobaan.`;
        showAlert(message, 'success'); // Menampilkan popup alert untuk menang
        disableGame();
        playAgainButton.style.display = 'block';
    } else if (attempts >= maxAttempts) {
        feedback.textContent = `Game over! Kata yang benar adalah ${correctWord}.`;
        showAlert(`Game over! Kata yang benar adalah ${correctWord}.`, 'error'); // Menampilkan popup alert untuk kalah
        disableGame();
        playAgainButton.style.display = 'block';
    }
}

playAgainButton.addEventListener('click', () => {
    resetGame();
});

function initializeGrid(wordLength) {
    for (let i = 0; i < maxAttempts; i++) {
        const row = document.createElement('div');
        row.classList.add('word-row');
        for (let j = 0; j < wordLength; j++) {
            const box = document.createElement('div');
            box.classList.add('letter-box');
            row.appendChild(box);
        }
        wordGrid.appendChild(row);
    }
}

function updateGrid(currentGuess) {
    const row = wordGrid.children[attempts - 1];
    const letterBoxes = row.querySelectorAll('.letter-box');
    
    const correctIndexes = [];
    
    // Menghitung letter-box yang tepat dan present
    for (let i = 0; i < currentGuess.length; i++) {
        const box = letterBoxes[i];
        box.textContent = currentGuess[i];
        box.classList.remove('correct', 'present', 'absent');

        if (currentGuess[i] === correctWord[i]) {
            box.classList.add('correct');
            correctIndexes.push(i); // Menyimpan indeks huruf yang benar
        } else if (correctWord.includes(currentGuess[i])) {
            box.classList.add('present');
        } else {
            box.classList.add('absent');
        }
    }

    // Menangani letter-box yang present tapi bukan correct
    for (let i = 0; i < currentGuess.length; i++) {
        if (!correctIndexes.includes(i) && correctWord.includes(currentGuess[i])) {
            letterBoxes[i].classList.add('present');
        }
    }
}

function disableGame() {
    guessInput.disabled = true;
}

function resetGame() {
    correctWord = getRandomWord(playerNames);
    attempts = 0;
    guessInput.value = "";
    guessInput.disabled = false;
    feedback.textContent = "";
    playAgainButton.style.display = 'none';
    initializeGrid(correctWord.length);
}

// Function to show popup using SweetAlert
function showAlert(message, icon) {
    Swal.fire({
        title: icon === 'success' ? 'Selamat!' : 'Game Over',
        text: message,
        icon: icon,
        confirmButtonText: 'OK'
    }).then((result) => {
        if (result.isConfirmed) {
            resetGame(); // Reset game after confirming
        }
    });
}

function getRandomWord(words) {
    return words[Math.floor(Math.random() * words.length)];
}

// Tampilkan popup cara bermain saat halaman dimuat
window.onload = function() {
    showInstructions();
};

function showInstructions() {
    Swal.fire({
        title: 'Cara Bermain Football Word',
        html: `
            <p>Tebak nama pemain bola dalam 6 percobaan. Setelah setiap tebakan, warna kotak akan berubah untuk menunjukkan apakah huruf:</p>
            <ul>
                <li><span style="color: #6aaa64;">Hijau</span>: Benar dan di posisi yang tepat.</li>
                <li><span style="color: #c9b458;">Kuning</span>: Ada dalam kata tetapi salah posisi.</li>
                <li><span style="color: #787c7e;">Abu-abu</span>: Tidak ada dalam kata.</li>
            </ul>
        `,
        icon: 'info',
        confirmButtonText: 'OK'
    });
}
