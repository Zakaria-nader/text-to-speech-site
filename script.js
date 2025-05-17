const textInput = document.getElementById('text');
const voiceSelect = document.getElementById('voiceSelect');
const rateInput = document.getElementById('rate');
const pitchInput = document.getElementById('pitch');
const rateValue = document.getElementById('rateValue');
const pitchValue = document.getElementById('pitchValue');

let voices = [];

function loadVoices() {
  voices = window.speechSynthesis.getVoices();
  voiceSelect.innerHTML = '';
  voices
    .filter(voice => voice.lang.startsWith('ar') || voice.name.includes("Arabic"))
    .forEach(voice => {
      const option = document.createElement('option');
      option.textContent = `${voice.name} (${voice.lang})`;
      option.value = voice.name;
      voiceSelect.appendChild(option);
    });

  if (voiceSelect.options.length === 0) {
    const option = document.createElement('option');
    option.textContent = 'لا توجد أصوات عربية مدعومة';
    voiceSelect.appendChild(option);
  }
}

window.speechSynthesis.onvoiceschanged = loadVoices;

function speakText() {
  if (!window.speechSynthesis) {
    alert("المتصفح لا يدعم هذه الميزة");
    return;
  }

  window.speechSynthesis.cancel();

  const text = textInput.value.trim();
  if (!text) return alert('يرجى إدخال نص.');

  const chunkSize = 200;
  let index = 0;

  function speakChunk() {
    if (index >= text.length) return;

    let chunk = text.substring(index, index + chunkSize);
    const lastSpace = chunk.lastIndexOf(' ');
    if (lastSpace > -1 && index + chunkSize < text.length) {
      chunk = chunk.substring(0, lastSpace);
      index += lastSpace + 1;
    } else {
      index += chunkSize;
    }

    const utterance = new SpeechSynthesisUtterance(chunk);
    const selectedVoice = voices.find(voice => voice.name === voiceSelect.value);
    if (selectedVoice) utterance.voice = selectedVoice;

    utterance.rate = parseFloat(rateInput.value);
    utterance.pitch = parseFloat(pitchInput.value);
    utterance.lang = 'ar-SA';

    utterance.onend = speakChunk;
    window.speechSynthesis.speak(utterance);
  }

  speakChunk();
}

rateInput.addEventListener('input', () => {
  rateValue.textContent = rateInput.value;
});

pitchInput.addEventListener('input', () => {
  pitchValue.textContent = pitchInput.value;
});

window.onload = loadVoices;
