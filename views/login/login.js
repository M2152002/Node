const form = document.getElementById('form');

const Email = document.getElementById('email');
const Password = document.getElementById('password');

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
    try {
    const email = Email.value;
    const password = Password.value;

        if (!email || !password) {
            alert('Please fill in all the fields');
            return;
        }

    const User = { email: email, password: password };
    
    const response = await axios.post('http://localhost:3000/user/login', User)

    if(response.status === 200) {
        alert('Login successful!');
        const UserData = { email: email };
        localStorage.setItem('UserData', JSON.stringify(UserData));
    
        window.location.href ='../expense/expense.html';
    }
     else {
        alert('Login failed. Incorrect email or password.');    }
    } 
    catch(error) {
        console.error('Error:', error);
        alert('An error occurred during login.');
    }
});