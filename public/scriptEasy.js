const settings = {
  input: document.querySelector('input'),
  letters: Array.from(document.querySelectorAll('[data-letters]')),
  specs: Array.from(document.querySelectorAll('[data-spec]')),
  textExample: document.querySelector('#textExample'),
  symbolsPerMinute: document.querySelector('#symbolsPerMinute'),
  wordsPerMinute: document.querySelector('#wordsPerMinute'),
  errorPercent: document.querySelector('#errorPercent'),
  restartBtn: document.querySelector('#button-again'),
  modal: document.querySelector('.modal'),
};

function generateRandomSequence() {
  const characters =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890:,.?`"';
  const maxCharacters = 50;
  let sequence = '';

  while (sequence.length < maxCharacters) {
    const sequenceLength = Math.floor(Math.random() * 3) + 2;
    const randomIndex = Math.floor(Math.random() * characters.length);
    const randomSubstring = characters.substring(
      randomIndex,
      randomIndex + sequenceLength
    );
    sequence += randomSubstring + ' ';
  }

  return sequence.trim();
}

const randomSequence = generateRandomSequence();

const party = {
  randomSequence,
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
  settings.input.addEventListener('keydown', keyDownHandler);
  settings.input.addEventListener('keyup', keyUpHandler);
  viewUpdate();
}
function toggleKeyClass(key, add) {
  const matchingKeys = settings.letters.filter((x) =>
    x.dataset.letters.includes(key)
  );

  matchingKeys.forEach((key) => key.classList.toggle('pressed', add));

  const ownSpec = settings.specs.filter((x) => x.dataset.spec === key);

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

  press(event.key);

  if (pressedKey === 'enter') {
    press('\n');
  }

  if (isSpaceKey) {
    party.wordCounter++;
  }

  if (
    party.currentStringIndex === party.strings.length - 1 &&
    party.currentPressedIndex === party.strings[party.currentStringIndex].length
  ) {
    input.blur();
    settings.modal.classList.remove('hidden');
    settings.restartBtn.addEventListener('click', () => {
      location.reload();
      settings.modal.classList.add('hidden');
    });
    return;
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
  party.randomSequence = party.randomSequence.replace(/\n/g, '\n ');
  const words = party.randomSequence.split(' ');
  let string = [];

  for (const word of words) {
    const newStringLength =
      [...string, word].join(' ').length + !word.includes('\n');

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
    viewUpdate(settings.textExample);
  }
}

function statisticCount(party, settings) {
  if (party.started) {
    const symbolsPerMinute =
      party.timerCounter !== 0
        ? Math.round((60000 * party.symbolCounter) / party.timerCounter)
        : 0;

    const errorPercent =
      party.symbolCounter !== 0
        ? Math.floor((10000 * party.errorCounter) / party.symbolCounter / 100) +
          '%'
        : '0%';

    const wordsPerMinute =
      party.timerCounter !== 0
        ? Math.round((60000 * party.wordCounter) / party.timerCounter)
        : 0;

    settings.symbolsPerMinute.textContent = symbolsPerMinute.toString();
    settings.errorPercent.textContent = errorPercent;
    settings.wordsPerMinute.textContent = wordsPerMinute.toString();
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
