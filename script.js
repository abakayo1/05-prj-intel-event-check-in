//Variables
const form = document.getElementById("checkInForm");
const name = document.getElementById("attendeeName");
const team = document.getElementById("teamSelect");
const greeting = document.getElementById("greeting");
const attendeeCount = document.getElementById("attendeeCount");
const waterCounter = document.getElementById("waterCount");
const zeroCounter = document.getElementById("zeroCount");
const powerCounter = document.getElementById("powerCount");
const waterAttendees = document.getElementById("waterAttendees");
const zeroAttendees = document.getElementById("zeroAttendees");
const powerAttendees = document.getElementById("powerAttendees");
const resetAttendanceBtn = document.getElementById("resetAttendanceBtn");

//Track attendance

let count = Number(localStorage.getItem("attendanceCount")) || 0;
const maxCount = 50;

attendeeCount.textContent = count;
waterCounter.textContent = Number(localStorage.getItem("waterCount")) || 0;
zeroCounter.textContent = Number(localStorage.getItem("zeroCount")) || 0;
powerCounter.textContent = Number(localStorage.getItem("powerCount")) || 0;
let attendees = JSON.parse(localStorage.getItem("attendees")) || [];

function displayAttendees() {
  waterAttendees.innerHTML = "";
  zeroAttendees.innerHTML = "";
  powerAttendees.innerHTML = "";

  for (let i = 0; i < attendees.length; i++) {
    const attendeeItem = document.createElement("li");
    attendeeItem.className = "attendee-row";
    attendeeItem.textContent = attendees[i].name;

    const teamAttendeeList = document.getElementById(
      attendees[i].teamId + "Attendees",
    );
    if (teamAttendeeList) {
      teamAttendeeList.appendChild(attendeeItem);
    }
  }
}

displayAttendees();

resetAttendanceBtn.addEventListener("click", function () {
  const shouldReset = window.confirm(
    "Reset attendance counts and the attendee list?",
  );

  if (!shouldReset) {
    return;
  }

  count = 0;
  attendees = [];

  localStorage.removeItem("attendanceCount");
  localStorage.removeItem("waterCount");
  localStorage.removeItem("zeroCount");
  localStorage.removeItem("powerCount");
  localStorage.removeItem("attendees");

  attendeeCount.textContent = 0;
  waterCounter.textContent = 0;
  zeroCounter.textContent = 0;
  powerCounter.textContent = 0;
  document.getElementById("progressBar").style.width = "0%";
  greeting.textContent = "";
  greeting.style.display = "none";
  greeting.classList.remove("success-message");
  const teamCards = document.querySelectorAll(".team-card");
  for (let i = 0; i < teamCards.length; i++) {
    teamCards[i].classList.remove("winning-team");
  }
  displayAttendees();
});

//Handling form submission using event listener

form.addEventListener("submit", function (e) {
  e.preventDefault(); //prevents page from refreshing upon submission.

  //Get form values

  const nameInput = name.value;
  const teamSelect = team.value;
  const teamName = team.options[team.selectedIndex].text;

  console.log(nameInput, teamName);

  //Incrementing Count Variable;
  count++;
  attendeeCount.textContent = count;
  localStorage.setItem("attendanceCount", count);
  console.log("Total check-ins: " + count);

  //Updating progress bar

  const percent = Math.round((count / maxCount) * 100) + "%";
  console.log(`Progress: ${percent}`);

  //Updating Team Counter;

  const teamCounter = document.getElementById(teamSelect + "Count");

  teamCounter.textContent = parseInt(teamCounter.textContent) + 1;
  localStorage.setItem(teamSelect + "Count", teamCounter.textContent);

  attendees.push({
    name: nameInput,
    team: teamName,
    teamId: teamSelect,
  });
  localStorage.setItem("attendees", JSON.stringify(attendees));
  displayAttendees();

  //Welcome message

  const message = `<strong> Welcome, ${nameInput} from ${teamName}!</strong>`;
  greeting.innerHTML = message;
  greeting.classList.add("success-message");
  greeting.style.display = "block";

  form.reset(); //Resets the form after submission

  //Updaing progress bar width

  const progressBar = document.getElementById("progressBar");
  progressBar.style.width = percent;

  //Celebration Message for winning team

  if (count === maxCount) {
    const waterCount = parseInt(
      document.getElementById("waterCount").textContent,
    );
    const zeroCount = parseInt(
      document.getElementById("zeroCount").textContent,
    );
    const powerCount = parseInt(
      document.getElementById("powerCount").textContent,
    );

    let highestTeamCount = waterCount;
    let winningTeamName = document.querySelector(
      ".team-card.water .team-name",
    ).textContent;
    let winningTeamCard = document.querySelector(".team-card.water");

    if (zeroCount > highestTeamCount) {
      highestTeamCount = zeroCount;
      winningTeamName = document.querySelector(
        ".team-card.zero .team-name",
      ).textContent;
      winningTeamCard = document.querySelector(".team-card.zero");
    }

    if (powerCount > highestTeamCount) {
      winningTeamName = document.querySelector(
        ".team-card.power .team-name",
      ).textContent;
      winningTeamCard = document.querySelector(".team-card.power");
    }

    greeting.innerHTML = `Congratulations! <strong>${winningTeamName}</strong> is the winning team!`;
    greeting.classList.add("success-message");
    winningTeamCard.classList.add("winning-team");
  }

  //Highlighting team card of the winning team
});
