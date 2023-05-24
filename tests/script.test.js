/**
 * @jest-environment jsdom
 */

// Mock the necessary dependencies and setup the initial state
jest.mock('../script', () => ({
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


const  {press}  = require('../script.js');

describe("press", () => {
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
        strings: ['Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ac metus id massa posuere blandit a eget mauris.'],
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
        strings: ['Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ac metus id massa posuere blandit a eget mauris.'],
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