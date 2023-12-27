document.getElementById('form').addEventListener('submit', function (e) {
    addExpense(e);
});

function addExpense(e) {
    e.preventDefault();

    const amount = document.getElementById('amount');
    const description = document.getElementById('description');
    const category = document.getElementById('category');

    const expenseDetails = {
        amount : amount.value,
        description : description.value,
        category : category.value,
        
    }

    console.log(expenseDetails);
    axios.post('http://localhost:3000/expense/addExpense', expenseDetails)
    .then((response) =>{
        if(response.status === 201) {
            addExpenseToUI(response.data.expense);
        } else {
            throw new Error('Failed to create new expense');
        }
    }) .catch((err) => {
        showError(err)
    })
}

window.addEventListener("DOMContentLoaded", () => {
    axios.get('http://localhost:3000/expense/getExpenses').then(response => {
        response.data.expenses.forEach(expense => {
            addExpenseToUI(expense);
        })
    })
});

function addExpenseToUI(expense) {
    const expenseList = document.getElementById('expense-list');
    const listItem = document.createElement('li');
    listItem.id = `expense-item-${expense.id}`;

    listItem.innerHTML = `
        <strong>Amount:</strong> ${expense.amount},
        <strong>Description:</strong> ${expense.description},
        <strong>Category:</strong> ${expense.category} 
        <button onclick="deleteExpense('${expense.id}')" class="delete">Delete Expense</button>`;

    expenseList.appendChild(listItem);
}

function deleteExpense(expenseId) {
    axios.delete(`http://localhost:3000/expense/deleteExpense/${expenseId}`)
        .then((response) => {
            if (response.status === 200) {
                removeExpenseFromUI(expenseId);
            } else {
                throw new Error('Failed to delete expense');
            }
        })
        .catch((err) => {
            showError(err);
        });
}

function removeExpenseFromUI(expenseId) {
    const listItem = document.getElementById(`expense-item-${expenseId}`);
    
    if (listItem) {
        listItem.remove();
    }
}

function showError(error) {
    alert(`Error: ${error.message}`);
}