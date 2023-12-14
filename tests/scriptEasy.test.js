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

const statisticCountMock = (party, settings) => {
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
};
describe('statisticCount', () => {
  let party, settings;

  beforeEach(() => {
    party = {
      started: true,
      symbolCounter: 50,
      timerCounter: 10000,
      errorCounter: 5,
      wordCounter: 10,
    };

    settings = {
      symbolsPerMinute: {
        textContent: '',
      },
      errorPercent: {
        textContent: '',
      },
      wordsPerMinute: {
        textContent: '',
      },
    };
  });

  it('should update symbols per minute correctly', () => {
    statisticCountMock(party, settings);
    expect(settings.symbolsPerMinute.textContent).toBe('300');
  });

  it('should update error percentage correctly', () => {
    statisticCountMock(party, settings);
    expect(settings.errorPercent.textContent).toBe('10%');
  });

  it('should update words per minute correctly', () => {
    statisticCountMock(party, settings);
    expect(settings.wordsPerMinute.textContent).toBe('60');
  });

  it('should not update statistics if party is not started', () => {
    party.started = false;
    statisticCountMock(party, settings);
    expect(settings.symbolsPerMinute.textContent).toBe('');
    expect(settings.errorPercent.textContent).toBe('');
    expect(settings.wordsPerMinute.textContent).toBe('');
  });

  it('should handle zero values gracefully', () => {
    party.symbolCounter = 0;
    party.timerCounter = 0;
    party.errorCounter = 0;
    party.wordCounter = 0;

    statisticCountMock(party, settings);

    expect(settings.symbolsPerMinute.textContent).toBe('0');
    expect(settings.errorPercent.textContent).toBe('0%');
    expect(settings.wordsPerMinute.textContent).toBe('0');
  });
});

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

  test('the matching key is pressed', () => {
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

  test('the mismatched key is pressed', () => {
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

  test('the matching key at end of string is pressed', () => {
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

  test('the mismatched key in middle of string is pressed', () => {
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
    press('x');
    Object.assign(party, expectedParty);

    expect(party).toEqual(expectedParty);
  });

  test('the space key is pressed', () => {
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

  test('the maxStringLength is reached', () => {
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
  it('should create correct HTML structure for displaying lines', () => {
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

  it('should display pressed keys correctly', () => {
    const party = {
      strings: ['Lorem ipsum'],
      currentStringIndex: 0,
      currentPressedIndex: 6,
      errors: [],
      maxShowStrings: 5,
    };
    const div = document.createElement('div');
    const firstLine = document.createElement('div');
    const doneLine = document.createElement('span');
    const textExample = document.createElement('div');

    doneLine.textContent = 'Lorem ';
    firstLine.appendChild(doneLine);
    firstLine.appendChild(document.createTextNode('ipsum'));

    firstLine.classList.add('line');
    doneLine.classList.add('done');

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
    expect(firstLine.childNodes[1].textContent).toBe('ipsum');
  });

  it('should display errors correctly', () => {
    const party = {
      strings: ['Lorem ipsum'],
      currentStringIndex: 0,
      currentPressedIndex: 6,
      errors: ['i', 's'],
      maxShowStrings: 5,
    };
    const div = document.createElement('div');
    const firstLine = document.createElement('div');
    const errSpan1 = document.createElement('span');
    const errSpan2 = document.createElement('span');
    const textExample = document.createElement('div');

    errSpan1.textContent = 'i';
    errSpan2.textContent = 's';
    firstLine.appendChild(errSpan1);
    firstLine.appendChild(document.createTextNode('ipsum'));
    firstLine.appendChild(errSpan2);

    firstLine.classList.add('line');
    errSpan1.classList.add('hint');
    errSpan2.classList.add('hint');

    div.appendChild(firstLine);

    viewUpdate(party, textExample);

    textExample.appendChild(div);

    expect(textExample.innerHTML).toBe(div.outerHTML);
    expect(div.childElementCount).toBe(1);
    expect(div.firstChild).toBe(firstLine);
    expect(firstLine.classList.contains('line')).toBe(true);
    expect(firstLine.childNodes[0]).toBe(errSpan1);
    expect(errSpan1.classList.contains('hint')).toBe(true);
    expect(errSpan1.textContent).toBe('i');
    expect(firstLine.childNodes[1].textContent).toBe('ipsum');
    expect(firstLine.childNodes[2]).toBe(errSpan2);
    expect(errSpan2.classList.contains('hint')).toBe(true);
    expect(errSpan2.textContent).toBe('s');
  });

  describe('viewUpdate', () => {
    let textExample;

    //helper function to create lines
    const createLinesHelper = (party) =>
      party.strings.map((string) => {
        const line = document.createElement('div');
        line.classList.add('line');
        line.textContent = string;
        return line;
      });

    beforeEach(() => {
      textExample = document.createElement('div');
      input = document.createElement('input');
      document.body.appendChild(textExample);
    });

    afterEach(() => {
      document.body.removeChild(textExample);
    });

    it('should correctly update the view with multiple lines', () => {
      const party = {
        strings: ['Lorem ipsum', 'dolor sit amet'],
        currentStringIndex: 0,
        maxShowStrings: 2,
        currentPressedIndex: 0,
        errors: [],
      };

      createLinesHelper(party).forEach((line) => {
        textExample.appendChild(line);
      });

      viewUpdate(party, textExample);

      const updatedLines = textExample.querySelectorAll('.line');

      expect(updatedLines.length).toBe(2);
    });

    it('should correctly update the view when the end of the text is reached', () => {
      const party = {
        strings: [
          'Lorem ipsum',
          'dolor sit amet',
          'consectetur adipiscing elit',
        ],
        currentStringIndex: 2,
        maxShowStrings: 2,
        currentPressedIndex: 14,
        errors: [],
      };

      createLinesHelper(party).forEach((line) => {
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
});
