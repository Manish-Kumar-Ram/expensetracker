// Code for tax calculation, AI integration, and logout feature
const balance = document.querySelector("#balance");
const inc_amt = document.querySelector("#inc-amt");
const exp_amt = document.querySelector("#exp-amt");
const tax_amt = document.querySelector("#tax-amt");
const trans = document.querySelector("#trans");
const form = document.querySelector("#transactionForm");
const description = document.querySelector("#desc");
const amount = document.querySelector("#amount");
const logoutBtn = document.querySelector("#logout");

// Sample transactions array
let transactions = [];

// Function to calculate taxes
function calculateTaxes() {
    // Sample tax calculation logic
    const totalIncome = transactions.reduce((acc, cur) => cur.amount > 0 ? acc + cur.amount : acc, 0);
    const totalExpense = transactions.reduce((acc, cur) => cur.amount < 0 ? acc + cur.amount : acc, 0);
    const taxRate = 0.2; // 20% tax rate (example)
    const taxAmount = totalIncome * taxRate;
    return taxAmount;
}

// Function for AI categorization
function categorizeTransaction(description, amount) {
    // Sample AI categorization logic
    const categories = ['Groceries', 'Utilities', 'Entertainment', 'Others'];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    return randomCategory;
}

// Function to logout user
function logout() {
    // Sample logout logic
    // Clear user session, local storage, or perform any other necessary actions
    alert("You have been logged out.");
}

// Function to add a new transaction
function addTransaction() {
    if (description.value.trim() === "" || amount.value.trim() === "") {
        alert("Please enter a description and amount.");
    } else {
        const transaction = {
            id: Math.floor(Math.random() * 10000000),
            description: description.value,
            amount: parseFloat(amount.value)
        };
        transactions.push(transaction);
        updateTransactionsUI(transaction);
        updateAmount();
        updateLocalStorage();
        updateChart();
        description.value = "";
        amount.value = "";
    }
}

// Function to update transaction details UI
function updateTransactionsUI(transaction) {
    const item = document.createElement("li");
    item.classList.add(transaction.amount < 0 ? "exp" : "inc");
    item.innerHTML = `
        ${transaction.description} <span>${transaction.amount >= 0 ? '+' : ''}₹ ${Math.abs(transaction.amount)}</span>
        <button class="delete-btn" data-id="${transaction.id}"><i class="fa-solid fa-trash"></i></button>
    `;
    trans.appendChild(item);

    // Add event listener for delete button
    const deleteButton = item.querySelector('.delete-btn');
    deleteButton.addEventListener('click', () => {
        const transactionId = deleteButton.getAttribute('data-id');
        deleteTransaction(transactionId); // Assuming you have a function to delete the transaction by its ID
        item.remove(); // Remove the transaction item from the UI
    });
}

function deleteTransaction(transactionId) {
    // Assuming transactions is an array containing all transactions
    transactions = transactions.filter(transaction => transaction.id !== transactionId);
    // After deleting from data source, you may want to update any summary or re-render UI, etc.
}


// Function to update balance, income, expenses, and taxes
function updateAmount() {
    const totalIncome = transactions.reduce((acc, cur) => cur.amount > 0 ? acc + cur.amount : acc, 0);
    const totalExpense = transactions.reduce((acc, cur) => cur.amount < 0 ? acc + cur.amount : acc, 0);
    const taxAmount = calculateTaxes();
    balance.textContent = `₹ ${totalIncome + totalExpense - taxAmount}`;
    inc_amt.textContent = `₹ ${totalIncome}`;
    exp_amt.textContent = `₹ ${Math.abs(totalExpense)}`;
    tax_amt.textContent = `₹ ${taxAmount}`;
}

// Function to update chart
function updateChart() {
    const ctx = document.getElementById("myChart").getContext("2d");
    const income = transactions.filter(transaction => transaction.amount > 0).reduce((acc, transaction) => acc + transaction.amount, 0);
    const expense = transactions.filter(transaction => transaction.amount < 0).reduce((acc, transaction) => acc + transaction.amount, 0);
    const data = {
        labels: ['Income', 'Expense'],
        datasets: [{
            label: 'Amount',
            backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(255, 99, 132, 0.2)'],
            borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
            borderWidth: 1,
            data: [income, Math.abs(expense)]
        }]
    };
    const options = {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    };
    const myChart = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: options
    });
}

// Function to update local storage
function updateLocalStorage() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Event listener for form submission
// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Select the form element
    const form = document.querySelector('form');

    // Check if the form element exists
    if (form) {
        // Add event listener only if the form element exists
        form.addEventListener("submit", function(event) {
            event.preventDefault(); // Prevent the default form submission behavior
            addTransaction(); // Call the addTransaction function to handle the form submission
        });
    } else {
        console.error('Form element not found.');
    }
});


// Load initial data when the window is loaded
window.addEventListener("load", function() {
    // Retrieve transactions from localStorage or use an empty array
    const localStorageTrans = JSON.parse(localStorage.getItem("transactions"));
    transactions = localStorageTrans !== null ? localStorageTrans : [];
    transactions.forEach(updateTransactionsUI); // Update transaction details UI
     // Update balance, income, expenses, and taxes
    // Update chart
});



// Event listener for delete buttons
trans.addEventListener("click", function(event) {
    if (event.target.classList.contains("delete-btn")) {
        const itemId = parseInt(event.target.getAttribute("data-id"));
        transactions = transactions.filter(transaction => transaction.id !== itemId);
        updateLocalStorage();
        trans.innerHTML = ""; // Clear the transaction list
        transactions.forEach(updateTransactionsUI); // Re-render the transaction list
        updateAmount();
        updateChart();
    }
});
// Function to create a trash bin icon dynamically


// Function to create a pencil icon dynamically

// Example usage:


// Function to calculate taxes
function calculateTaxes() {
    const totalIncome = transactions.reduce((acc, cur) => cur.amount > 0 ? acc + cur.amount : acc, 0);
    const totalExpense = transactions.reduce((acc, cur) => cur.amount < 0 ? acc + cur.amount : acc, 0);

    let taxAmount = 0;

    // Apply 10% tax on income above 100000
    if (totalIncome > 100000 && totalIncome <= 200000) {
        taxAmount += (totalIncome - 100000) * 0.1;
    }
    // Apply 5% tax on income above 200000
    else if (totalIncome > 200000) {
        taxAmount += (totalIncome - 200000) * 0.05;
    }

    // Example: Apply 5% tax on expenses below 10000
    if (totalExpense < 10000 && taxAmount >= 0) {
        taxAmount += totalExpense * 0.05;
    }

    // Ensure taxAmount is not negative and not exceeding 200000
    taxAmount = Math.max(0, Math.min(taxAmount, 200000));

    return taxAmount;
}



// Retrieve username from localStorage and display it
// Retrieve username from localStorage and display it
const usernameElement = document.getElementById('userGreeting');
const username = localStorage.getItem('Username');

// if (username) {
//     
//     // console.log(username);
// } else {
//     usernameElement.innerText = `Hi, there!`;
// }
usernameElement.innerText = `Hi, ${username}!`;

