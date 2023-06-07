/**
 * @jest-environment jsdom
 */

// Mock the necessary dependencies and setup the initial state
jest.mock('../public/script.js', () => ({
  party: {
    strings: ['Lorem ipsum', 'dolor sit'],
    currentStringIndex: 0,
    currentPressedIndex: 0,
    errors: [],
    maxShowStrings: 5,
  },
  viewUpdate: jest.fn(),
  press: jest.fn(),
  createParty: jest.fn(),
}));

const { press, viewUpdate } = require('../public/script.js');

describe('press', () => {
  let initialParty, initialPartyStr;

  beforeEach(() => {
    initialParty = {
      text: 'Lorem ipsum dolor',
      strings: ['Lorem ipsum dolor'],
      maxStringLength: 70,
      maxShowStrings: 5,
      currentStringIndex: 0,
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
    initialPartyStr = {
      text: 'Lorem ipsum dolor',
      strings: ['Lorem ipsum dolor'],
      maxStringLength: 70,
      maxShowStrings: 5,
      currentStringIndex: 0,
      currentPressedIndex: 10,
      errors: [],
      started: true,
      startTimer: expect.any(Number),
      timerCounter: expect.any(Number),
      symbolCounter: 10,
      wordCounter: 1,
      errorCounter: 0,
      statisticFlag: true,
    };
  });

  it('press - matching key', () => {
    const expectedParty = {
      text: 'Lorem ipsum dolor',
      strings: ['Lorem ipsum dolor'],
      maxStringLength: 70,
      maxShowStrings: 5,
      currentStringIndex: 0,
      currentPressedIndex: 1,
      errors: [],
      started: true,
      startTimer: expect.any(Number),
      timerCounter: expect.any(Number),
      symbolCounter: 1,
      wordCounter: 0,
      errorCounter: 0,
      statisticFlag: true,
    };

    const party = Object.assign({}, initialParty);
    press('L');
    Object.assign(party, expectedParty);

    expect(party).toEqual(expectedParty);
  });

  it('press - mismatched key', () => {
    const expectedParty = {
      text: 'Lorem ipsum dolor',
      strings: ['Lorem ipsum dolor'],
      maxStringLength: 70,
      maxShowStrings: 5,
      currentStringIndex: 0,
      currentPressedIndex: 0,
      errors: ['L'],
      started: true,
      startTimer: expect.any(Number),
      timerCounter: expect.any(Number),
      symbolCounter: 1,
      wordCounter: 0,
      errorCounter: 1,
      statisticFlag: true,
    };

    const party = Object.assign({}, initialParty);
    press('b');
    Object.assign(party, expectedParty);

    expect(party).toEqual(expectedParty);
  });

  it('press - matching key at end of string', () => {
    const expectedParty = {
      text: 'Lorem ipsum dolor',
      strings: ['Lorem ipsum dolor'],
      maxStringLength: 70,
      maxShowStrings: 5,
      currentStringIndex: 0,
      currentPressedIndex: 17,
      errors: [],
      started: true,
      startTimer: expect.any(Number),
      timerCounter: expect.any(Number),
      symbolCounter: 17,
      wordCounter: 1,
      errorCounter: 0,
      statisticFlag: true,
    };

    const party = Object.assign({}, initialParty);
    press('x');
    Object.assign(party, expectedParty);

    expect(party).toEqual(expectedParty);
  });

  it('press - mismatched key in middle of string', () => {
    const pressedKey = 'x';

    const expectedParty = {
      text: 'Lorem ipsum dolor',
      strings: ['Lorem ipsum dolor'],
      maxStringLength: 70,
      maxShowStrings: 5,
      currentStringIndex: 0,
      currentPressedIndex: 11,
      errors: [],
      started: true,
      startTimer: expect.any(Number),
      timerCounter: expect.any(Number),
      symbolCounter: 11,
      wordCounter: 2,
      errorCounter: 0,
      statisticFlag: true,
    };

    const party = Object.assign({}, initialPartyStr);
    press(pressedKey);
    Object.assign(party, expectedParty);

    expect(party).toEqual(expectedParty);
  });

  it('press - space key', () => {
    const expectedParty = {
      text: 'Lorem ipsum dolor',
      strings: ['Lorem ipsum dolor'],
      maxStringLength: 70,
      maxShowStrings: 5,
      currentStringIndex: 0,
      currentPressedIndex: 6,
      errors: [],
      started: true,
      startTimer: expect.any(Number),
      timerCounter: expect.any(Number),
      symbolCounter: 6,
      wordCounter: 2,
      errorCounter: 0,
      statisticFlag: true,
    };

    const party = Object.assign({}, initialPartyStr);
    press(' ');
    Object.assign(party, expectedParty);

    expect(party).toEqual(expectedParty);
  });
  it('press - missing pressedKey', () => {
    const expectedParty = { ...initialParty };

    const party = Object.assign({}, initialParty);
    press();

    expect(party).toEqual(expectedParty);
  });
  it('press - invalid pressedKey', () => {
    const invalidKey = 123;

    const expectedParty = { ...initialParty };

    const party = Object.assign({}, initialParty);
    press(invalidKey);

    expect(party).toEqual(expectedParty);
  });
  it('press - maxStringLength reached', () => {
    const partyForNestLine = {
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ac metus id massa posuere blandit a eget mauris.',
      strings: [
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ac metus id massa posuere blandit a eget mauris.',
      ],
      maxStringLength: 30, // Max string length set to 30 for testing
      maxShowStrings: 5,
      currentStringIndex: 0,
      currentPressedIndex: 30, // Max string length reached
      errors: [],
      started: true,
      startTimer: 0,
      timerCounter: 0,
      symbolCounter: 30, // Max string length reached
      wordCounter: 0, // Word count is manually set for testing
      errorCounter: 0,
      statisticFlag: false,
    };

    const expectedParty = {
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ac metus id massa posuere blandit a eget mauris.',
      strings: [
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ac metus id massa posuere blandit a eget mauris.',
      ],
      maxStringLength: 30,
      maxShowStrings: 5,
      currentStringIndex: 0, // Current string index moved to the next line
      currentPressedIndex: 30, // Reset current pressed index to start of the new line
      errors: [],
      started: true,
      startTimer: expect.any(Number),
      timerCounter: expect.any(Number),
      symbolCounter: 30, // Reset symbol counter to start of the new line
      wordCounter: 0, // Increment word count for the new line
      errorCounter: 0,
      statisticFlag: false,
    };

    const party = { ...partyForNestLine };
    press('.');

    expect(party).toEqual(expectedParty);
  });
});

describe('viewUpdate', () => {
  it('viewUpdate - creates correct HTML structure for displaying lines', () => {
    const party = {
      strings: ['Lorem ipsum dolor sit'],
      currentStringIndex: 0,
      currentPressedIndex: 0,
      errors: [],
      maxShowStrings: 5,
    };
    const div = document.createElement('div');
    const firstLine = document.createElement('div');
    const doneLine = document.createElement('span');
    const textExample = document.createElement('div');

    firstLine.appendChild(doneLine);
    firstLine.classList.add('line');
    doneLine.classList.add('done');
    div.appendChild(firstLine);

    viewUpdate(party, textExample);

    // Convert elements to JSON strings
    const divJson = JSON.stringify(div);
    const textExampleJson = JSON.stringify(textExample);

    expect(textExampleJson).toBe(divJson);
    expect(div.childElementCount).toBe(party.strings.length);
    expect(div.firstChild).toBe(firstLine);
    expect(firstLine.classList.contains('line')).toBe(true);
    expect(firstLine.firstChild).toBe(doneLine);
    expect(doneLine.classList.contains('done')).toBe(true);
  });
  test('viewUpdate - displays pressed keys and errors correctly', () => {
    const party = {
      strings: ['Lorem ipsum'],
      currentStringIndex: 0,
      currentPressedIndex: 6,
      errors: ['a', 's'],
      maxShowStrings: 5,
    };
    const div = document.createElement('div');
    const firstLine = document.createElement('div');
    const doneLine = document.createElement('span');
    const errSpan1 = document.createElement('span');
    const errSpan2 = document.createElement('span');
    const textExample = document.createElement('div');

    doneLine.textContent = 'Lorem ';
    errSpan1.textContent = 'i';
    errSpan2.textContent = 's';
    firstLine.appendChild(doneLine);
    firstLine.appendChild(errSpan1);
    firstLine.appendChild(document.createTextNode('ipsum'));
    firstLine.appendChild(errSpan2);

    firstLine.classList.add('line');
    doneLine.classList.add('done');
    errSpan1.classList.add('hint');
    errSpan2.classList.add('hint');

    div.appendChild(firstLine);

    viewUpdate(party, textExample);

    textExample.appendChild(div);

    expect(textExample.innerHTML).toBe(div.outerHTML);
    expect(div.childElementCount).toBe(1);
    expect(div.firstChild).toBe(firstLine);
    expect(firstLine.classList.contains('line')).toBe(true);
    expect(firstLine.firstChild).toBe(doneLine);
    expect(doneLine.classList.contains('done')).toBe(true);
    expect(doneLine.textContent).toBe('Lorem ');
    expect(firstLine.childNodes[1]).toBe(errSpan1);
    expect(errSpan1.classList.contains('hint')).toBe(true);
    expect(errSpan1.textContent).toBe('i');
    expect(firstLine.childNodes[2].textContent).toBe('ipsum');
    expect(firstLine.childNodes[3]).toBe(errSpan2);
    expect(errSpan2.classList.contains('hint')).toBe(true);
    expect(errSpan2.textContent).toBe('s');
  });
});
describe('viewUpdate', () => {
  let textExample;
  beforeEach(() => {
    textExample = document.createElement('div');
    input = document.createElement('input');
    document.body.appendChild(textExample);
  });

  afterEach(() => {
    document.body.removeChild(textExample);
  });

  it('viewUpdate - correctly updates the view with multiple lines', () => {
    const party = {
      strings: ['Lorem ipsum', 'dolor sit amet'],
      currentStringIndex: 0,
      maxShowStrings: 2,
      currentPressedIndex: 0,
      errors: [],
    };

    //helper function to create lines
    const lines = party.strings.map((string) => {
      const line = document.createElement('div');
      line.classList.add('line');
      line.textContent = string;
      return line;
    });

    lines.forEach((line) => {
      textExample.appendChild(line);
    });

    viewUpdate(party, textExample);

    const updatedLines = textExample.querySelectorAll('.line');

    expect(updatedLines.length).toBe(2);
  });
  it('viewUpdate - correctly updates the view when reaching the end of the text', () => {
    const party = {
      strings: ['Lorem ipsum', 'dolor sit amet', 'consectetur adipiscing elit'],
      currentStringIndex: 2,
      maxShowStrings: 2,
      currentPressedIndex: 14,
      errors: [],
    };

    const lines = party.strings.map((string) => {
      const line = document.createElement('div');
      line.classList.add('line');
      line.textContent = string;
      return line;
    });

    lines.forEach((line) => {
      textExample.appendChild(line);
    });

    viewUpdate(party, textExample);

    const updatedLines = textExample.querySelectorAll('.line');
    const lastLineText = updatedLines[updatedLines.length - 1]?.textContent;
    const hintSpans = textExample.querySelectorAll('.hint');

    expect(updatedLines.length).toBe(party.strings.length);
    expect(lastLineText).toBe(party.strings[2]);
    expect(hintSpans.length).toBe(0);
  });
});
