(function () {
    // Questions in order with label text and validation functions
    const questions = [
      {
        key: 'lunchServers',
        label: 'How many servers are working the Lunch shift?',
        min: 0,
        placeholder: 'e.g. 2',
        validate: (val) => Number.isInteger(val) && val >= 0,
        errorMsg: 'Please enter a valid integer number (minimum 0).',
      },
      {
        key: 'dinnerServers',
        label: 'How many servers are working the Dinner shift?',
        min: 0,
        placeholder: 'e.g. 2',
        validate: (val) => Number.isInteger(val) && val >= 0,
        errorMsg: 'Please enter a valid integer number (minimum 0).',
      },
      {
        key: 'lunchTipsTotal',
        label: 'How much total tips did Lunch shift make?',
        min: 0,
        placeholder: 'e.g. 150.00',
        validate: (val) => typeof val === 'number' && val >= 0,
        errorMsg: 'Please enter a valid number for lunch tips (zero or positive).',
      },
      {
        key: 'closeOfDayTips',
        label: 'How much tips were collected at Close of Day?',
        min: 0,
        placeholder: 'e.g. 300.00',
        validate: function (val, answers) {
          return typeof val === 'number' && val >= 0 && val >= answers.lunchTipsTotal;
        },
        errorMsg: 'Please enter a valid number (zero or positive) not less than lunch tips total.',
      },
    ];
  
    const questionContainer = document.getElementById('question-container');
    const questionLabel = document.getElementById('question-label');
    const answerInput = document.getElementById('answer-input');
    const errorMessage = document.getElementById('error-message');
    const nextButton = document.getElementById('next-button');
  
    const resultContainer = document.getElementById('result-container');
    const resLunchServers = document.getElementById('res-lunchServers');
    const resDinnerServers = document.getElementById('res-dinnerServers');
    const resLunchTipsTotal = document.getElementById('res-lunchTipsTotal');
    const resCloseOfDayTips = document.getElementById('res-closeOfDayTips');
    const resDinnerTips = document.getElementById('res-dinnerTips');
    const resTipPerLunchServer = document.getElementById('res-tipPerLunchServer');
    const resTipPerDinnerServer = document.getElementById('res-tipPerDinnerServer');
    const restartButton = document.getElementById('restart-button');
  
    let currentQuestionIndex = 0;
    const answers = {};
  
    // Format currency helper
    function formatCurrency(value) {
      return value.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
  
    // Show current question
    function showQuestion(index) {
      const question = questions[index];
      questionLabel.textContent = question.label;
      answerInput.value = '';
      answerInput.type = 'number';
      answerInput.min = question.min;
      answerInput.step = question.key.includes('Servers') ? '1' : '0.01';
      answerInput.placeholder = question.placeholder;
      answerInput.setAttribute('aria-describedby', 'error-message');
      errorMessage.textContent = '';
      questionContainer.classList.remove('fade-out');
      questionContainer.classList.add('fade-in');
      answerInput.focus();
      nextButton.disabled = false;
    }
  
    // Hide question with fade out before next question
    function hideQuestion(callback) {
      questionContainer.classList.remove('fade-in');
      questionContainer.classList.add('fade-out');
      setTimeout(() => {
        callback();
        questionContainer.classList.remove('fade-out');
        questionContainer.classList.add('fade-in');
      }, 400);
    }
  
    function showResults() {
      // Calculate dinner tips and tips per server
      const dinnerTips = answers.closeOfDayTips - answers.lunchTipsTotal;
      const tipPerLunchServer = answers.lunchTipsTotal / answers.lunchServers;
      const tipPerDinnerServer = dinnerTips / answers.dinnerServers;
  
      // Fill results
      resLunchServers.textContent = answers.lunchServers;
      resDinnerServers.textContent = answers.dinnerServers;
      resLunchTipsTotal.textContent = formatCurrency(answers.lunchTipsTotal);
      resCloseOfDayTips.textContent = formatCurrency(answers.closeOfDayTips);
      resDinnerTips.textContent = formatCurrency(dinnerTips);
      resTipPerLunchServer.textContent = formatCurrency(tipPerLunchServer);
      resTipPerDinnerServer.textContent = formatCurrency(tipPerDinnerServer);
  
      // Hide questions and show results
      questionContainer.style.display = 'none';
      resultContainer.style.display = 'flex';
      resultContainer.scrollIntoView({ behavior: 'smooth' });
      restartButton.focus();
    }
  
    nextButton.addEventListener('click', () => {
      // Parse input value
      const rawValue = answerInput.value.trim();
      let inputValue;
  
      if (questions[currentQuestionIndex].key.includes('Servers')) {
        // Parse integer value
        inputValue = Number(rawValue);
        if (!Number.isInteger(inputValue)) {
          errorMessage.textContent = 'Please enter a valid whole number.';
          answerInput.focus();
          return;
        }
      } else {
        inputValue = Number(rawValue);
      }
  
      const question = questions[currentQuestionIndex];
  
      // Validate
      if (rawValue === '' || Number.isNaN(inputValue)) {
        errorMessage.textContent = 'This field is required.';
        answerInput.focus();
        return;
      }
  
      if (!question.validate(inputValue, answers)) {
        errorMessage.textContent = question.errorMsg;
        answerInput.focus();
        return;
      }
  
      // Save answer
      answers[question.key] = inputValue;
      errorMessage.textContent = '';
  
      // If last question, show results
      if (currentQuestionIndex === questions.length - 1) {
        hideQuestion(showResults);
      } else {
        // Move to next question
        currentQuestionIndex++;
        hideQuestion(() => {
          showQuestion(currentQuestionIndex);
        });
      }
    });
  
    // Support Enter key to submit current question
    answerInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        nextButton.click();
      }
    });
  
    restartButton.addEventListener('click', () => {
      // Reset state
      currentQuestionIndex = 0;
      for (const key in answers) {
        if (Object.hasOwnProperty.call(answers, key)) {
          delete answers[key];
        }
      }
      resultContainer.style.display = 'none';
      questionContainer.style.display = 'flex';
      showQuestion(currentQuestionIndex);
      questionContainer.scrollIntoView({ behavior: 'smooth' });
    });
  
    // Initialize first question
    showQuestion(currentQuestionIndex);
  })();
  