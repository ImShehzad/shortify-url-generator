const generateBtn = document.getElementById('generateBtn');
    const copyBtn = document.getElementById('copyBtn');
    const longUrlInput = document.getElementById('longUrl');
    const shortUrlInput = document.getElementById('shortUrl');
    const resultDiv = document.getElementById('result');

    generateBtn.addEventListener('click', async () => {
      const longUrl = longUrlInput.value.trim();
      if (!longUrl) return alert("Please enter a URL.");

      const res = await fetch('http://localhost:3000/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ longUrl})
      });

      const data = await res.json();
      if (data.shortUrl) {
        shortUrlInput.value = data.shortUrl;
        resultDiv.style.display = 'block';
        copyBtn.disabled = false;
      } else {
        alert("Error generating short URL.");
      }
    });

    copyBtn.addEventListener('click', () => {
      shortUrlInput.select();
      document.execCommand('copy');
      copyBtn.textContent = "Copied!";
      setTimeout(() => (copyBtn.textContent = "Copy URL"), 2000);
    });