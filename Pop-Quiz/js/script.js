// Event listener
document.querySelector("button").addEventListener("click", gradeQuiz);

// Constant for the correct answers
const correctAnswers = {
    "q1": "sacramento",
    "q2": "Missouri",
    "q3": ["T.Jefferson", "T.Roosevelt"],
    "q4": "Rhode Island",
    "q5": ["colorado", "the colorado", "colorado river", "the colorado river"],
    "q6": "Austin",
    "q7": ["Lake Superior", "Lake Michigan", "Lake Huron", "Lake Erie", "Lake Ontario"],
    "q8": "The Rio Grande",
    "q9": "florida",
    "q10": "Washington, D.C."
}

// Global variables
let score = 0;
let attempts = localStorage.getItem("total_attempts");
displayQ4Choices();
displayQ8Choices();

function displayQ4Choices() {
    let q4ChoicesArray = ["Maine", "Rhode Island", "Maryland", "Delaware"]; 
    q4ChoicesArray = _.shuffle(q4ChoicesArray);
    document.querySelector("#q4Choices").innerHTML = "";

    for (let i = 0; i < q4ChoicesArray.length; i++) {
        document.querySelector("#q4Choices").innerHTML += `
            <input type="radio" name="q4" id="${q4ChoicesArray[i]}" value="${q4ChoicesArray[i]}">
            <label for="${q4ChoicesArray[i]}"> ${q4ChoicesArray[i]} </label> 
            `;
    }
}

function displayQ8Choices() {
    let q8ChoicesArray = ["The Nile", "The Rio Grande", "The Mississippi", "The Yukon"]; 
    q8ChoicesArray = _.shuffle(q8ChoicesArray);
    document.querySelector("#q8Choices").innerHTML = "";
    
    for (let i = 0; i < q8ChoicesArray.length; i++) {
        document.querySelector("#q8Choices").innerHTML += `
            <input type="radio" name="q8" id="${q8ChoicesArray[i]}" value="${q8ChoicesArray[i]}">
            <label for="${q8ChoicesArray[i]}"> ${q8ChoicesArray[i]} </label> 
            `;
    }
}

function isFormValid() {
    let isValid = true;
    if (document.querySelector("#q1").value == "") {
        isValid = false;
        document.querySelector("#validationFdbk").innerHTML = "Question 1 was not answered";
    }
    return isValid;
}

function gradeQuiz() {
    console.log("Grading quiz...");
    document.querySelector("#validationFdbk").innerHTML = "";
    if (!isFormValid()) {
        return;
    }

    // variables
    score = 0;
    let q1Response = document.querySelector("#q1").value.toLowerCase();
    let q2Response = document.querySelector("#q2").value.toLowerCase();
    let q4Response = document.querySelector("input[name=q4]:checked");
    let q5Response = document.querySelector("#q5").value.toLowerCase();
    let q6Response = document.querySelector("#q6").value.toLowerCase();
    let q8Response = document.querySelector("input[name=q8]:checked");
    let q9Response = document.querySelector("#q9").value.toLowerCase();
    let q10Response = document.querySelector("#q10").value.toLowerCase();

    console.log(q1Response);
    console.log(q2Response);

    // grading question 1
    if (q1Response == "sacramento") {
        rightAnswer(1);
    } else {
        wrongAnswer(1);
    }

    // grading question 2
    if (q2Response == "mo") {
        rightAnswer(2);
    } else {
        wrongAnswer(2);
    }

    // grading question 3
    if (document.querySelector("#Jefferson").checked && document.querySelector("#Roosevelt").checked && !document.querySelector("#Jackson").checked && 
        !document.querySelector("#Franklin").checked) {
        rightAnswer(3);
    } else {
        wrongAnswer(3);
    }

    // grading question 4
    if (q4Response && q4Response.value == "Rhode Island") {
        rightAnswer(4);
    } else {
        wrongAnswer(4);
    }

    // grading question 5
    if (
        q5Response && 
        (q5Response == "colorado river" || 
        q5Response == "the colorado river" || 
        q5Response == "the colorado" || 
        q5Response == "colorado")
    ) {
        rightAnswer(5);
    } else {
        wrongAnswer(5);
    }

    // grading question 6
    if (q6Response == "au") {
        rightAnswer(6);
    } else {
        wrongAnswer(6);
    }

    // grading question 7
    if (document.querySelector("#Lake_Superior").checked &&
        document.querySelector("#Lake_Michigan").checked &&
        document.querySelector("#Lake_Huron").checked &&
        document.querySelector("#Lake_Erie").checked &&
        document.querySelector("#Lake_Ontario").checked &&
        !document.querySelector("#Lake_Arrowhead").checked &&
        !document.querySelector("#Lake_Tahoe").checked) {
        rightAnswer(7);
    } else {
        wrongAnswer(7);
    }

    // grading question 8
    if (q8Response && q8Response.value == "The Rio Grande") {
        rightAnswer(8);
    } else {
        wrongAnswer(8);
    }

    // grading question 9
    if (q9Response == "florida") {
        rightAnswer(9);
    } else {
        wrongAnswer(9);
    }

    // grading question 10
    if (q10Response == "dc") {
        rightAnswer(10);
    } else {
        wrongAnswer(10);
    }

    document.querySelector("#totalScore").innerHTML = (`Total Score: ${score}`);
    document.querySelector("#totalAttempts").innerHTML = (`Total Attempts: ${++attempts}`);
    localStorage.setItem("total_attempts", attempts);

    if (score >= 80) {
        document.querySelector("#totalScore").innerHTML += " 👍👍👍 Congratulations!";
        document.querySelector("#totalScore").style.setProperty("color", "green", "important");
    } else {
        document.querySelector("#totalScore").style.setProperty("color", "red", "important");
    }
}

function rightAnswer(index) {
    document.querySelector(`#q${index}Feedback`).innerHTML = "Correct!";
    document.querySelector(`#q${index}Feedback`).className = "bg-success text-white";
    document.querySelector(`#markImg${index}`).innerHTML = "<img src='img/checkmark.png' alt='checkmark'>";
    score += 10;
}

// function wrongAnswer(index) {
//     document.querySelector(`#q${index}Feedback`).innerHTML = "Incorrect!";
//     document.querySelector(`#q${index}Feedback`).className = "bg-danger text-white";
//     document.querySelector(`#markImg${index}`).innerHTML = "<img src='img/xmark.png' alt='xmark'>";
// }

function wrongAnswer(index) {
    let correct = correctAnswers["q" + index];
    // If it's an array, join it into a string for display
    let correctText = Array.isArray(correct) ? correct.join(", ") : correct;
    document.querySelector(`#q${index}Feedback`).innerHTML = 
        `Incorrect! The correct answer is: ${correctText}`;
    document.querySelector(`#q${index}Feedback`).className = "bg-danger text-white";
    document.querySelector(`#markImg${index}`).innerHTML = 
        "<img src='img/xmark.png' alt='xmark'>";
}