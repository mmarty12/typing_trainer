const input = document.querySelector("input");
const letters = Array.from(document.querySelectorAll("[data-letters]"));
const specs = Array.from(document.querySelectorAll("[data-spec]"));

const text = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
occaecat cupidatat non proident, sunt in culpa qui officia deserunt
mollit anim id est laborum...`;

init();

function init() {
  input.addEventListener("keydown", keydownHandler);
  input.addEventListener("keyup", keyupHandler);
}
function toggleKeyClass(key, add) {
  const matchingKeys = letters.filter((x) => x.dataset.letters.includes(key));

  matchingKeys.forEach((key) => key.classList.toggle("pressed", add));

  const ownSpec = specs.filter((x) => x.dataset.spec === key);

  if (ownSpec.length) {
    ownSpec.forEach((spec) => spec.classList.toggle("pressed", add));
  }
}

function keydownHandler(event) {
  event.preventDefault();

  const isSpaceKey = event.key === " ";

  const pressedKey = isSpaceKey ? "space" : event.key.toLowerCase();

  toggleKeyClass(pressedKey, true);

  // Перевірка для Shift
  if (pressedKey === "shift") {
    toggleKeyClass("shift", true);
  }
}

function keyupHandler(event) {
  event.preventDefault();

  const isSpaceKey = event.key === " ";

  const pressedKey = isSpaceKey ? "space" : event.key.toLowerCase();

  toggleKeyClass(pressedKey, false);

  // Перевірка для Shift
  if (pressedKey === "shift") {
    toggleKeyClass("shift", false);
  }
}
