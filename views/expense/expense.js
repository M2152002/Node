function addExpense(e) {
    e.preventDefault();
  
    const userDetails = {
        amount : e.target.amount.value,
        description : e.target.description.value,
        category : e.target.category.value
    }

    console.log(userDetails);
    const token = localStorage.getItem('token');
    
    axios.post('http://localhost:3000/expense/addexpense', userDetails,  { headers: {"Authorization" : token} })  
    .then((response) => {
        addNewExpensetoUI(response.data.expense);
    }) 
    .catch((err) => {
        showError(err)
    })
}

function showPremiumuserMessage() {
    document.getElementById('rzp-button').style.visibility = "hidden"
    document.getElementById('message').innerHTML = "You are a premium user "
}

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

window.addEventListener('DOMContentLoaded', ()=> {
    const token  = localStorage.getItem('token')
    const decodeToken = parseJwt(token)
    console.log(decodeToken)
    const ispremiumuser = decodeToken.ispremiumuser
    if(ispremiumuser){
        showPremiumuserMessage()
        showLeaderboard()
    }
    axios.get('http://localhost:3000/expense/getexpenses', { headers: {"Authorization" : token} })
    .then(response => {
            response.data.expenses.forEach(expense => {

                addNewExpensetoUI(expense);
            })
    }).catch(err => {
        showError(err)
    })
});

function addNewExpensetoUI(expense) {
    const parentElement = document.getElementById('expense-list');
    const expenseElemId = `expense-${expense.id}`;
    const li = document.createElement('li');
    li.id = expenseElemId;
    li.innerHTML = `${expense.amount} - ${expense.category} - ${expense.description}
        <button onclick='deleteExpense(event, ${expense.id})'>
            Delete Expense
        </button>`;

    parentElement.appendChild(li);
}

function deleteExpense(e, expenseId) {
    e.preventDefault();
    const token = localStorage.getItem('token');
    axios.delete(`http://localhost:3000/expense/deleteexpense/${expenseId}`, { headers: { "Authorization": token }})
    .then((response) => {
        removeExpensefromUI(expenseId);
    })
    .catch((err) => {
        showError(err);
    });
}

function showError(error) {
    document.body.innerHTML += `<div style="color: red;">${error}</div>`
}

function showLeaderboard(){
    const inputElement = document.createElement("input")
    inputElement.type = "button"
    inputElement.value = 'Show Leaderboard'
    inputElement.onclick = async() => {
        const token = localStorage.getItem('token')
        const userLeaderBoardArray = await axios.get('http://localhost:3000/premium/showLeaderBoard', { headers: {"Authorization": token} })
        console.log(userLeaderBoardArray);

        var leaderboardElem = document.getElementById('leaderboard')
        leaderboardElem.innerHTML += '<h1 style="color: black;"> Leader Board </h1>';
        userLeaderBoardArray.data.forEach((userDetails) => {
            leaderboardElem.innerHTML += `<li>Name - ${userDetails.name} Total Expense - ${userDetails.total_cost || 0} </li>`;
        });
    }
    document.getElementById("message").appendChild(inputElement);
}

function removeExpensefromUI(expenseId) {
    const expenseElemId = `expense-${expenseId}`;
    document.getElementById(expenseElemId).remove();
}

document.getElementById('rzp-button').onclick = async () => {
    const token = localStorage.getItem('token');
    const response  = await axios.get('http://localhost:3000/purchase/premiummembership', { headers: {"Authorization" : token} });
    console.log(response);
    var options = {
        "key": response.data.key_id,
        "order_id": response.data.order.id,
        "handler": async function(response) {
            const res = await axios.post('http://localhost:3000/purchase/updatetransactionstatus',{
            order_id: options.order_id,
            payment_id: response.razorpay_payment_id,
        }, { headers: { "Authorization": token } })

        console.log(res)
        alert('You are a Premium User Now');
        document.getElementById('rzp-button').style.visibility = "hidden"
        document.getElementById('message').innerHTML = "You are a premium user"
        localStorage.setItem('token', res.data.token)
         showLeaderboard()
    }
    };
    const rzp1 = new Razorpay(options);
    rzp1.open();
    e.preventDefault();
  
    rzp1.on('payment.failed', function (response){
      console.log(response)
      alert('Something went wrong')
   });
  }