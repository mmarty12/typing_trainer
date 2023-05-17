const input = document.querySelector('input');
const letters = Array.from(document.querySelectorAll('[data-letters]'));
const specs = Array.from(document.querySelectorAll('[data-spec]'));
const textExample = document.querySelector('#textExample');

const text = `ass anv anb dd ssa ert lor s-- abc abc fde qwe asw wasd wsad`;

const party = createParty(text);
init();

function init() {
  input.addEventListener('keydown', keyDownHandler);
  input.addEventListener('keyup', keyUpHandler);
  viewUpdate();
}
function toggleKeyClass(key, add) {
  const matchingKeys = letters.filter((x) => x.dataset.letters.includes(key));

  matchingKeys.forEach((key) => key.classList.toggle('pressed', add));

  const ownSpec = specs.filter((x) => x.dataset.spec === key);

  if (ownSpec.length) {
    ownSpec.forEach((spec) => spec.classList.toggle('pressed', add));
  }
}

function keyDownHandler(event) {
  event.preventDefault();

  const isSpaceKey = event.key === ' ';
  const pressedKey = isSpaceKey ? 'space' : event.key.toLowerCase();

  toggleKeyClass(pressedKey, true);

  if (pressedKey === 'shift') {
    toggleKeyClass('shift', true);
  }
  if (isSpaceKey) press(' ');
  if (pressedKey === 'enter') press('\n');
  press(event.key);
}

function keyUpHandler(event) {
  event.preventDefault();

  const isSpaceKey = event.key === ' ';
  const pressedKey = isSpaceKey ? 'space' : event.key.toLowerCase();

  toggleKeyClass(pressedKey, false);

  if (pressedKey === 'shift') {
    toggleKeyClass('shift', false);
  }
}

function createParty(text) {
  const party = {
    text,
    strings: [],
    maxStringLength: 70,
    maxShowStrings: 3,
    currentStringIndex: 0,
    currentPressedIndex: 0,
    errors: [],
  };
  party.text = party.text.replace(/\n/g, '\n ');
  const words = party.text.split(' ');
  let string = [];

  for (const word of words) {
    const newStringLength = [...string, word].join(' ').length + !word.includes('\n');

    if (newStringLength > party.maxStringLength) {
      party.strings.push(string.join(' ') + ' ');
      string = [];
    }

    string.push(word);

    if (word.includes('\n')) {
      party.strings.push(string.join(' '));
    }
  }
  if (string.length) {
    party.strings.push(string.join(' '));
  }
  return party;
}

function press(pressedKey) {
  const string = party.strings[party.currentStringIndex];
  const mustKey = string[party.currentPressedIndex];
  if (pressedKey === mustKey) {
    party.currentPressedIndex++;
    if (string.length < party.currentPressedIndex) {
      party.currentPressedIndex = 0;
      party.currentStringIndex++;
    }
  } else if (!party.errors.includes(mustKey)) party.errors.push(mustKey);
  viewUpdate();
}

function viewUpdate() {
  const string = party.strings[party.currentStringIndex];
  const shownString = party.strings.slice(
    party.currentStringIndex,
    party.currentStringIndex + party.maxShowStrings
  );
  const div = document.createElement('div');
  const firstLine = document.createElement('div');
  firstLine.classList.add('line');
  div.append(firstLine);
  const doneLine = document.createElement('span');
  doneLine.classList.add('done');
  doneLine.textContent = string.slice(0, party.currentPressedIndex);

  firstLine.append(
    doneLine,
    ...string
      .slice(party.currentPressedIndex)
      .split('')
      .map((pressedKey) => {
        return pressedKey;
      })
  );

  for (let i = 1; i < shownString.length; i++) {
    const line = document.createElement('div');
    line.classList.add('line');
    div.append(line);

    line.append(
      ...shownString[i].split('').map((pressedKey) => {
        return pressedKey;
      })
    );
  }
  textExample.innerHTML = '';
  textExample.append(div);
  input.value = string.slice(0, party.currentPressedIndex);
}
