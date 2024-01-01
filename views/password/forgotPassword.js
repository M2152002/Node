function forgotpassword(e) {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (!email || !password || !confirmPassword) {
        document.body.innerHTML += '<div style="color:red;">Please fill in all fields</div>';
        return;
    }

    const userDetails = {
        email: email,
        newpassword: password,
    };

    console.log(userDetails);

    axios.post('http://localhost:3000/password/forgotpassword',userDetails)
    .then(response => {
        if(response.status === 200){
            document.body.innerHTML += '<div style="color:red;">Mail Successfuly sent <div>'
        } else {
            throw new Error('Something went wrong!!!')
        }
    }).catch(err => {
        document.body.innerHTML += `<div style="color:red;">${err} <div>`;
    })
}