(function() {
    const symbols = ["🍒", "🍋", "🍊", "🍉", "🍇", "🍈"];
    let balance = 100;
    const jackpotSymbol = "🍒";
    const jackpotAmount = 500;
    let spinning = false;
  
    function spin() {
      return symbols[Math.floor(Math.random() * symbols.length)];
    }
  
    function updateBalance(amount) {
      balance += amount;
      document.getElementById('balance').textContent = balance;
      if (balance <= 0) {
        document.getElementById('bankrupt').style.display = 'block';
        document.getElementById('controls').style.display = 'none';
        document.getElementById('spinFiveButton').style.display = 'none';
      }
    }
  
    function updateSlots(slot1, slot2, slot3) {
      document.getElementById('slot1').textContent = slot1;
      document.getElementById('slot2').textContent = slot2;
      document.getElementById('slot3').textContent = slot3;
    }
  
    function animateSpin(callback) {
      let spins = 0;
      const spinInterval = setInterval(() => {
        if (spins >= 15) {
          clearInterval(spinInterval);
          callback();
          return;
        }
        updateSlots(spin(), spin(), spin());
        spins++;
      }, 80);
    }
  
    function handleSpin(numSpins) {
      if (balance <= 0 || spinning) return;
      spinning = true;
  
      const bet = parseInt(document.getElementById('betAmount').value, 10);
      if (isNaN(bet) || bet <= 0) {
        document.getElementById('message').textContent = "Invalid bet amount. Please enter a positive number.";
        spinning = false;
        return;
      }
  
      if (bet > balance) {
        document.getElementById('message').textContent = "Insufficient funds. Your current balance is: $" + balance;
        spinning = false;
        return;
      }
  
      let spinsRemaining = numSpins;
  
      function spinCallback() {
        if (spinsRemaining <= 0) {
          spinning = false;
          return;
        }
  
        const slot1 = spin();
        const slot2 = spin();
        const slot3 = spin();
        updateSlots(slot1, slot2, slot3);
        
        const won = slot1 === slot2 && slot2 === slot3;
        let result = slot1 + " | " + slot2 + " | " + slot3;
        
        if (won) {
          let winnings = bet * 2;
          if (slot1 === jackpotSymbol) winnings = jackpotAmount;
          updateBalance(winnings);
          result += "\nYou Win! You won $" + winnings;
        } else {
          updateBalance(-bet);
          result += "\nTry Again! You lost $" + bet;
        }
  
        document.getElementById('message').textContent = result;
        spinsRemaining--;
        if (spinsRemaining > 0) {
          animateSpin(spinCallback);
        } else {
          spinning = false;
        }
      }
  
      animateSpin(spinCallback);
    }
  
    document.getElementById('spinButton').onclick = function() {
      handleSpin(1);
    };
  
    document.getElementById('spinFiveButton').onclick = function() {
      handleSpin(5);
    };
  
    document.getElementById('exitButton').onclick = function() {
      if (confirm("Are you sure you want to exit?")) window.close();
    };
  })();
  