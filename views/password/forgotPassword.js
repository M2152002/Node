const form = document.getElementById('form');

const Email = document.getElementById('email');

form.addEventListener("DOMContentLoaded", async(e) => {
    e.preventDefault();

    const email = Email.value;

    try {
        if (!email) {
            alert('Please fill in all the fields');
            return;
        }
        const response = await axios.post('http://localhost:3000/password/forgotPassword', {
            email: email,
        });

        if (response.status === 200) {
            alert('Password reset initiated! Check your email for further instructions.');
        } else {
            alert('Password reset failed. Please check your email and try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred during the password reset process.');
    }
});