function dangerQuake() {
  // Select all elements within the body
  const elements = document.body.querySelectorAll("*");

  // Iterate over each element
  elements.forEach(element => {
    // Generate a random rotation angle between -180 and 180 degrees
    const randomAngle = Math.floor(Math.random() * 360) - 180;

    // Generate a random animation duration between 1 and 5 seconds
    const randomDuration = Math.random() * 4 + 1;

    // Apply the rotation and animation to each element using CSS
    element.style.transition = `transform ${randomDuration}s ease-in-out`;
    element.style.transform = `rotate(${randomAngle}deg)`;
  });
  localStorage.setItem("youBrokeIt", true);
  yesICanFixIt();
}

if (localStorage.getItem("youBrokeIt") === "true") {
  dangerQuake();
}

let keys = [];
let timeout;
window.addEventListener("keydown", event => {
  clearTimeout(timeout);
  keys.push(event.key);
  timeout = setTimeout(() => {
    keys = [];
  }, 10000);

  if (keys.join("").toLowerCase() === "hirejb") {
    localStorage.removeItem("youBrokeIt");
    const elements = document.body.querySelectorAll("*");
    elements.forEach(element => {
      element.style.transform = "";
    });
    const dialog = document.querySelector("dialog");
    if (dialog) {
      dialog.remove();
    }
  }
});

// open a <dialog> box with the message "You broke it, so hire me to fix it!" 5 seconds after the dangerQuake function is called
function yesICanFixIt() {
  setTimeout(() => {
    const dialog = document.createElement("dialog");
    // innerHTML with a link to my linkedin
    dialog.innerHTML = `<div class="p-8 text-center">
      <p>Now look at this mess! Hire me and I'll fix it!</p>
      <a class="px-4" target="_blank" href="https://www.linkedin.com/in/jakeberendes">Jake Berendes on LinkedIn</a>
    </div>
    `;
    document.body.appendChild(dialog);
    dialog.showModal();
  }, 5000);
}

// a button that requires 3 clicks to trigger the dangerQuake function
let clicks = 0;
// const button = document.createElement("button");
// const elements = document.body.querySelectorAll(".under-construction");
// button.innerHTML = "Click me 3 times!";
// button.addEventListener("click", () => {
//   clicks++;
//   if (clicks === 3) {
//     dangerQuake();
//     clicks = 0;
//   }
// });

function attemptToEnterADangerZone() {
  clicks++;
  if (clicks === 1) {
    alert("Nope! It's a mess in there! You can try but I wouldn't recommend it.");
  }
  if (clicks === 2) {
    alert("Seriously, it's dangerous! You could break something. Don't try it again.");
  }
  if (clicks === 3) {
    dangerQuake();
    clicks = 0;
  }
}
