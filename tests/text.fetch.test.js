const fetchMock = require('jest-fetch-mock');
fetchMock.enableMocks();

async function fetchDataMock(limit, party) {
  try {
    const response = await fetch(`https://api.api-ninjas.com/v1/facts?limit=${limit}`, {
      method: 'GET',
      headers: {
        'X-Api-Key': 'jIx09duDP4CP8cgkv9psxg==ovWjImlK67GSLMM8',
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok: ' + response.status);
    }

    const data = await response.json();
    party.text = data[0].fact;
    createParty();
    init();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

describe('fetchDataMock', () => {
  it('should append the text property with the received data', async () => {
    const limit = 30;
    const party = { text: '' };
    fetchMock.mockResponseOnce(
      JSON.stringify([
        {
          fact: 'Some text that came from a third-party API.',
        },
      ]),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );

    await fetchDataMock(limit, party);

    expect(party.text).toBe('Some text that came from a third-party API.');
  });

  it('should throw an error if the data fetching fails', async () => {
    const limit = 30;
    const party = { text: '' };
    fetchMock.mockResponseOnce('Error message', { status: 404 });

    try {
      await fetchDataMock(limit, party);
      throw new Error('Network response was not ok: 404');
    } catch (error) {
      expect(error.message).toBe('Network response was not ok: 404');
    }

    expect(party.text).toBe('');
  });

  it('should not append the text property if the data fetching fails', async () => {
    const limit = 30;
    const party = { text: '' };
    fetchMock.mockResponseOnce('Error message', { status: 404 });

    await fetchDataMock(limit, party);

    expect(party.text).toBe('');
  });
});
