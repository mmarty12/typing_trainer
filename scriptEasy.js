const input = document.querySelector("input");
const letters = Array.from(document.querySelectorAll("[data-letters]"));
const specs = Array.from(document.querySelectorAll("[data-spec]"));

const text = `ass anv anb dd ssa ert lor s-- abc abc fde qwe
asw wasd wsad uy yy yyy pps ';s we q we ali d adf ety vbv zzx 
doop ffdr rru n dde kopp kdowwa kksk ert d d d aas ll kjnc ccj
eoeoe ith as its yor sd plp a zxc fgo daw qw a;okf vvb dfd ,.. f
fieeh ty alpoi ertp wetkc a[oj] cnvd owasd vnx`;

const party = createParty(text);
console.log(party);
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

  if (pressedKey === "shift") {
    toggleKeyClass("shift", true);
  }
}

function keyupHandler(event) {
  event.preventDefault();

  const isSpaceKey = event.key === " ";

  const pressedKey = isSpaceKey ? "space" : event.key.toLowerCase();

  toggleKeyClass(pressedKey, false);

  if (pressedKey === "shift") {
    toggleKeyClass("shift", false);
  }
}

function createParty(text) {
  const party = {
    text,
    strings: [],
    maxStringLength: 70,
    maxShowStrings: 3,
    currentStringIndex: 0,
    currentPrintedIndex: 0,
    errors: [],
  };
  party.text = party.text.replace(/\n/g, "\n ");
  const words = party.text.split(" ");
  let string = [];

  for (const word of words) {
    const newStringLength =
      [...string, word].join(" ").length + !word.includes("\n");

    if (newStringLength > party.maxStringLength) {
      party.strings.push(string.join(" ") + " ");
      string = [];
    }

    string.push(word);

    if (word.includes("\n")) {
      party.strings.push(string.join(" "));
    }
  }
  if (string.length) {
    party.strings.push(string.join(" "));
  }
  return party;
}
