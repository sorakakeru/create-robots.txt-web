/**
 * Parts & Tips
 * https://parts-tips.com/
 */

const form = document.getElementById('txtForm');
const formTextarea = document.getElementById('rejection_path');
const formBtn = document.getElementById('create');
const resultArea = document.getElementById('result_area');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  while (resultArea.firstChild) {
    resultArea.removeChild(resultArea.firstChild);
  }

  const txtLines = formTextarea.value
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line.length);

  let inputResult = '';
  if (txtLines.length !== 0) {
    inputResult += `User-agent: *\n`;
    inputResult += txtLines.map(line => `Disallow: ${line}`).join('\n');
    inputResult += '\n\n';
  }

  async function loadTextFile(filename) {
    try {
      const res = await fetch(`./${filename}`);
      if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
      return await res.text();
    } catch (err) {
      console.error(err);
      return null;
    }
  }
  const partstipsResult = await loadTextFile('/lib/partstips.txt') || '';
  const aibotsResult = await loadTextFile('/lib/aibots.txt') || '';

  let mergeResult = '';
  mergeResult += `${partstipsResult}\n`;
  mergeResult += inputResult;
  mergeResult += aibotsResult;

  const textarea = Object.assign(
    document.createElement('textarea'), {
      id: 'copyarea',
      value: mergeResult,
      onclick() {
        this.focus();
        this.select();
      },
      readOnly: true
    }
  );
  const pText = document.createElement('p');
  pText.appendChild(textarea);
  resultArea.appendChild(pText);

  const blob = new Blob([mergeResult], {type : 'text/plain'});
  const url = URL.createObjectURL(blob);
  
  const a = Object.assign(
    document.createElement('a'), {
      id: 'btn_dl',
      class: 'btn_dl',
      download: 'robots.txt',
      textContent: 'robots.txtをダウンロードする'
    }
  );
  a.href = url;
  const pBtn = document.createElement('p');
  pBtn.appendChild(a);
  resultArea.appendChild(pBtn);

});
