document.querySelector("#zip").addEventListener("change", displayCity);    // allows access to html by id using change because click doesn't work
document.querySelector("#state").addEventListener("change", displayCounties);
document.querySelector("#username").addEventListener("input", checkUsername);
document.querySelector("#password").addEventListener("change", checkPassword);
document.querySelector("#passwordConfirm").addEventListener("input", checkPassword);
document.querySelector("#password").addEventListener("focus", suggestPassword);
document.querySelector("#signupForm").addEventListener("submit", function(event) {
    validateForm(event);
});

async function displayCity() {      // async returns a promise
    let zipCode = document.querySelector("#zip").value;     // # allows access to html by id
    let url =`https://csumb.space/api/cityInfoAPI.php?zip=${zipCode}`;    // ${} to access variable in string allowed by the use of backticks
    let response = await fetch(url);    // fetch returns a promise use await
    let data = await response.json();   // json returns a promise use await

    document.querySelector("#city").innerHTML = "";
    document.querySelector("#latitude").innerHTML = "";
    document.querySelector("#longitude").innerHTML = "";
    document.querySelector("#zipError").innerHTML = "";

    if (!data.city || !data.latitude || !data.longitude) {
        document.querySelector("#zipError").innerHTML = "Zip code not found";
    } else {
        document.querySelector("#city").innerHTML = data.city;
        document.querySelector("#latitude").innerHTML = data.latitude;
        document.querySelector("#longitude").innerHTML = data.longitude;
    }
}

async function displayCounties() {
    let state = document.querySelector("#state").value;
    let url = `https://csumb.space/api/countyListAPI.php?state=${state}`;
    let response = await fetch(url);
    let data = await response.json();
    let countyList = document.querySelector("#county");
    countyList.innerHTML = "<option> Select One </option>";

    for (let i = 0; i < data.length; i++) {
        countyList.innerHTML += `<option> ${data[i].county} </option>`;
    }
}

async function checkUsername(){
    let username = document.querySelector("#username").value;
    let url = `https://csumb.space/api/usernamesAPI.php?username=${username}`;
    let response = await fetch(url);
    let data = await response.json();
    let usernameError = document.querySelector("#usernameError");

    if (username.length == 0) {
        usernameError.innerHTML = "Username is required!";
        usernameError.style.color = "red";
    } else if (data.available && username.length > 0) {
        usernameError.innerHTML = "Username available!";
        usernameError.style.setProperty("color", "green", "important");
    } else {
        usernameError.innerHTML = "Username taken!";
        usernameError.style.color = "red";
    }
}

async function suggestPassword(){
    let url = `https://csumb.space/api/suggestedPassword.php?length=8`;
    let response = await fetch(url);
    let data = await response.json();
    document.querySelector("#suggestedPassword").innerHTML = `Suggested Password: ${data.password}`;
}

function checkPassword() {
    let isValid = true;

    let password = document.querySelector("#password").value;
    let confirmPassword = document.querySelector("#passwordConfirm").value;
    let confirmError = document.querySelector("#confirmError");
    let passwordError = document.querySelector("#passwordError");

    passwordError.innerHTML = "";
    confirmError.innerHTML = "";
    passwordError.style.display = "none";
    confirmError.style.display = "none";

    if (password.length === 0) {
        passwordError.innerHTML += "Must enter a password!<br>";
        isValid = false;
    }

    // Password length check
    if (password.length > 0 && password.length < 6) {
        passwordError.innerHTML += "Password must be at least 6 characters long!<br>";
        isValid = false;
    }

    // Confirm password empty check
    if (confirmPassword.length === 0) {
        confirmError.innerHTML += "Must confirm your password!<br>";
        isValid = false;
    }

    // Passwords match check (only if both fields have input)
    if (password.length > 0 && confirmPassword.length > 0 && password !== confirmPassword) {
        confirmError.innerHTML += "Passwords do not match!<br>";
        isValid = false;
    }

    // Display errors if they exist
    if (passwordError.innerHTML !== "") {
        passwordError.style.color = "red";
        passwordError.style.display = "inline";
    }

    if (confirmError.innerHTML !== "") {
        confirmError.style.color = "red";
        confirmError.style.display = "inline";
    }

    return isValid;
}

function validateForm(e) {
    let isValid = true;
    let username = document.querySelector("#username").value;
    if (username.length == 0) {
        document.querySelector("#usernameError").innerHTML = "Username is required!";
        document.querySelector("#usernameError").style.color = "red";
        isValid = false;
    }

    // await password validation as it now uses async function
    let passwordValid = checkPassword();
    if (!passwordValid) {
        isValid = false;
    }

    if (!isValid) {
        e.preventDefault(); // Prevent form submission if validation fails
    }
}
