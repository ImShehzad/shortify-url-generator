const API_URL = 'https://tinyport.onrender.com';

const generateBtn = document.getElementById('generateBtn');
const copyBtn = document.getElementById('copyBtn');
const longUrlInput = document.getElementById('longUrl');
const shortUrlInput = document.getElementById('shortUrl');
const resultDiv = document.getElementById('result');

async function generateShortUrl() {
  const longUrl = longUrlInput.value.trim();
  if (!longUrl) return alert("Please enter a URL.");

  try {
    const res = await fetch(`${API_URL}/shorten`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ longUrl })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Error generating short URL.');
    }

    if (data.shortUrl) {
      shortUrlInput.value = data.shortUrl;
      resultDiv.style.display = 'block';
      copyBtn.disabled = false;
      copyBtn.textContent = 'Copy Short URL';
      return;
    }

    throw new Error('Error generating short URL.');
  } catch (error) {
    alert(error.message || 'Error generating short URL.');
  }
}

function copyToClipboard() {
  shortUrlInput.select();
  document.execCommand('copy');
  copyBtn.textContent = 'Copied!';
  setTimeout(() => (copyBtn.textContent = 'Copy Short URL'), 2000);
}

generateBtn.addEventListener('click', generateShortUrl);
copyBtn.addEventListener('click', copyToClipboard);