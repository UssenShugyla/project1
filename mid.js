let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

const totalIncomeEl = document.getElementById("total-income");
const totalExpensesEl = document.getElementById("total-expenses");
const balanceEl = document.getElementById("balance");
const transactionForm = document.getElementById("transaction-form");
const historyEl = document.querySelector(".history");

let transactionsChart;

function updateDashboard() {
  const totalIncome = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpenses;

  totalIncomeEl.textContent = totalIncome;
  totalExpensesEl.textContent = totalExpenses;
  balanceEl.textContent = balance;
}

function renderTransactions() {
  historyEl.innerHTML = "";
  transactions.forEach((t, index) => {
    const div = document.createElement("div");
    div.className = `transaction ${t.type}`;
    div.innerHTML = `
      <span>${t.date} - ${t.category} (${t.type}):</span>
      <span>${t.type === "expense" ? "-" : "+"}$${t.amount}</span>
      <button onclick="deleteTransaction(${index})">Удалить</button>
    `;
    historyEl.appendChild(div);
  });
}


function saveTransactions() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

transactionForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const type = document.getElementById("type").value;
  const amount = parseFloat(document.getElementById("amount").value);
  const category = document.getElementById("category").value;
  const description = document.getElementById("description").value;

  if (isNaN(amount) || amount <= 0 || !category) {
    alert("Пожалуйста, заполните все поля корректно.");
    return;
  }

  const transaction = {
    type,
    amount,
    category,
    description,
    date: new Date().toLocaleDateString(),
  };

  transactions.push(transaction);
  saveTransactions();
  updateDashboard();
  renderTransactions();
  renderChart();
  transactionForm.reset();
});

function deleteTransaction(index) {
  transactions.splice(index, 1);
  saveTransactions();
  updateDashboard();
  renderTransactions();
  renderChart();
}

function renderChart() {
  const ctx = document.getElementById("transactionsChart").getContext("2d");

  if (transactionsChart) {
    transactionsChart.destroy();
  }

  const income = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  transactionsChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Доходы", "Расходы"],
      datasets: [
        {
          data: [income, expenses],
          backgroundColor: ["#66CDAA", "#DB7093"],
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
      },
    },
  });
}

updateDashboard();
renderTransactions();
renderChart();
