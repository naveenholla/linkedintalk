const API_URL = 'https://linkedinspeak.com/api/translate';

let currentDirection = 'human-to-linkedin';

const inputText = document.getElementById('input-text');
const charCount = document.getElementById('char-count');
const translateBtn = document.getElementById('translate-btn');
const btnLabel = document.getElementById('btn-label');
const btnSpinner = document.getElementById('btn-spinner');
const outputSection = document.getElementById('output-section');
const outputText = document.getElementById('output-text');
const copyBtn = document.getElementById('copy-btn');
const errorBox = document.getElementById('error-box');
const inputLabel = document.getElementById('input-label');

// Direction toggle
document.querySelectorAll('.dir-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    currentDirection = btn.dataset.direction;
    document.querySelectorAll('.dir-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');

    inputLabel.textContent =
      currentDirection === 'human-to-linkedin' ? 'Your text' : 'LinkedIn post / text';
    inputText.placeholder =
      currentDirection === 'human-to-linkedin'
        ? 'Type or paste text here...'
        : 'Paste corporate LinkedIn speak here...';

    hideOutput();
    hideError();
  });
});

// Char counter + enable/disable button
inputText.addEventListener('input', () => {
  const len = inputText.value.length;
  charCount.textContent = len;
  translateBtn.disabled = len === 0;
  hideOutput();
  hideError();
});

// Translate
translateBtn.addEventListener('click', async () => {
  const text = inputText.value.trim();
  if (!text) return;

  setLoading(true);
  hideOutput();
  hideError();

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        accept: '*/*',
      },
      body: JSON.stringify({
        text,
        direction: currentDirection,
        tone: 'standard',
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // The API returns { result: "..." } or { translation: "..." } - handle both shapes
    const result =
      data.result || data.translation || data.output || data.text || JSON.stringify(data);

    outputText.textContent = result;
    outputSection.classList.remove('hidden');
  } catch (err) {
    showError(err.message || 'Something went wrong. Please try again.');
  } finally {
    setLoading(false);
  }
});

// Copy to clipboard
copyBtn.addEventListener('click', async () => {
  const text = outputText.textContent;
  try {
    await navigator.clipboard.writeText(text);
    copyBtn.textContent = 'Copied!';
    setTimeout(() => {
      copyBtn.textContent = 'Copy';
    }, 1500);
  } catch {
    copyBtn.textContent = 'Failed';
  }
});

function setLoading(on) {
  translateBtn.disabled = on;
  btnLabel.textContent = on ? 'Translating...' : 'Translate';
  btnSpinner.classList.toggle('hidden', !on);
}

function hideOutput() {
  outputSection.classList.add('hidden');
  outputText.textContent = '';
}

function hideError() {
  errorBox.classList.add('hidden');
  errorBox.textContent = '';
}

function showError(msg) {
  errorBox.textContent = msg;
  errorBox.classList.remove('hidden');
}
