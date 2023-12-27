const form = document.getElementById('form');

const Name = document.getElementById('name');
const Email = document.getElementById('email');
const Phone = document.getElementById('phone');
const Password = document.getElementById('password');

// form.addEventListener("DOMContentLoaded", () => {
    form.addEventListener("submit", async(e) =>{
        e.preventDefault();
    try {
    const name = Name.value;        
    const email = Email.value;
    const phone = Phone.value;
    const password = Password.value;

    if (!name || !email || !phone || !password) {
        alert('Please fill in all the fields');
        return;
    }

    const newUser = { name: name, email: email, phone: phone, password: password };
    
    const response = await axios.post('http://localhost:3000/user/signup', newUser)

    if(response.status === 201) {
        alert('Signup successful!');
    }
     else {
        alert('Signup failed. User already exists.');
    }
    } 
    catch(error) {
        if(error.response.status === 400) {
            alert('User already exists');
        }
        else {
            console.error('Error:', error);
            alert('An error occurred during signup.');
        }
    }
});
// })