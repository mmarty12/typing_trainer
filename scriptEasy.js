const input = document.querySelector('input');
const letters = Array.from(document.querySelectorAll('[data-letters]'));
const specs = Array.from(document.querySelectorAll('[data-spec]'));
const textExample = document.querySelector('#textExample');
const symbolsPerMinute = document.querySelector('#symbolsPerMinute');
const wordsPerMinute = document.querySelector('#wordsPerMinute');
const errorPercent = document.querySelector('#errorPercent');

const text = `ass anv anb dd ssa ert lor s-- abc abc fde qwe asw wasd wsad`;
const textLength = text.length;

const party = {
  text,
  strings: [],
  maxStringLength: 70,
  maxShowStrings: 1,
  currentStringIndex: 0,
  maxStringIndex: 1,
  currentPressedIndex: 0,
  errors: [],
  started: false,
  startTimer: 0,
  timerCounter: 0,
  symbolCounter: 0,
  wordCounter: 0,
  errorCounter: 0,
  statisticFlag: false,
};

createParty();
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

  if (party.currentPressedIndex <= textLength - 1) {
    press(event.key);
  }

  if (pressedKey === 'enter') {
    press('\n');
  }

  if (isSpaceKey) {
    party.wordCounter++;
  }
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

function createParty() {
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
  party.started = true;
  if (!party.statisticFlag) {
    party.statisticFlag = true;
    party.startTimer = Date.now();
  }
  const string = party.strings[party.currentStringIndex];
  const mustKey = string[party.currentPressedIndex];
  if (pressedKey === mustKey) {
    party.currentPressedIndex++;
    if (string.length < party.currentPressedIndex) {
      party.currentPressedIndex = 0;
      party.currentStringIndex++;
      party.statisticFlag = false;
    }
  } else if (!party.errors.includes(mustKey)) {
    party.errors.push(mustKey);
    party.errorCounter++;
  }
  party.symbolCounter++;
  party.timerCounter = Date.now() - party.startTimer;
  if (party.currentStringIndex <= party.maxStringIndex) {
    viewUpdate(textExample);
  }
}

function statisticCount() {
  if (party.started) {
    symbolsPerMinute.textContent = Math.round((60000 * party.symbolCounter) / party.timerCounter);
    errorPercent.textContent =
      Math.floor((10000 * party.errorCounter) / party.symbolCounter / 100) + '%';
    wordsPerMinute.textContent = Math.round((60000 * party.wordCounter) / party.timerCounter);
  }
}

function viewUpdate() {
  const string = party.strings[party.currentStringIndex];
  const shownString = party.strings.slice(
    party.currentStringIndex,
    party.currentStringIndex + party.maxShowStrings
  );

  const div = document.createElement('div');
  textExample.innerHTML = '';
  textExample.append(div);

  const createLine = () => {
    const line = document.createElement('div');
    line.classList.add('line');
    return line;
  };

  const createSpan = (content, className) => {
    const span = document.createElement('span');
    span.textContent = content;
    span.classList.add(className);
    return span;
  };

  const createHintSpan = (content) => {
    return createSpan(content, 'hint');
  };

  const createKeyElements = (pressedKeys) => {
    return pressedKeys.map((pressedKey) => {
      if (party.errors.includes(pressedKey)) {
        return createHintSpan(pressedKey);
      }
      return pressedKey;
    });
  };

  const createLineWithKeys = (pressedKeys) => {
    const line = createLine();
    const keyElements = createKeyElements(pressedKeys);
    line.append(...keyElements);
    return line;
  };

  const doneLineContent = string.slice(0, party.currentPressedIndex);
  const doneLine = createSpan(doneLineContent, 'done');
  const firstLine = createLine();
  firstLine.append(
    doneLine,
    ...createKeyElements(string.slice(party.currentPressedIndex).split(''))
  );
  div.append(firstLine);

  for (let i = 1; i < shownString.length; i++) {
    const line = createLineWithKeys(shownString[i].split(''));
    div.append(line);
  }

  const input = document.getElementById('input');
  input.value = doneLineContent;

  if (party.currentPressedIndex === string.length) {
    statisticCount();
    if (party.currentStringIndex === party.strings.length - 1) {
      input.removeEventListener('keydown', keyDownHandler);
      input.removeEventListener('keyup', keyUpHandler);
    }
  }
}
