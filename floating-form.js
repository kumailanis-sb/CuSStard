(function createDraggableFloatingForm() {
  const style = document.createElement('style');
  const testStyle = document.createElement('style');
  let cssTemplate;

  fetch('https://kumailanis-sb.github.io/CuSStard/css-template.html')
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok');
      return response.text();
    })
    .then(css => {
      // Step 1: Remove <style> tags
      let stripped = css.replace(/<style[^>]*>/gi, '').replace(/<\/style>/gi, '');
      // Step 2: Update CSS selector
      stripped = stripped.replace(/^\s*html\.group-[^{]+{\s*/i, 'html:root {');
      cssTemplate = stripped.trim();
    })
    .catch(error => {
      console.error('Error fetching CSS template:', error);
    });

  style.textContent = `
    #floating-form {
      display: none;
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 320px;
      padding: 14px;
      background: white;
      box-shadow: 0 12px 20px rgba(0, 0, 0, 0.15);
      border-radius: 12px;
      z-index: 1000;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      font-size: 13px;
      cursor: move;
      animation: fadeIn 0.4s ease-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    #floating-form .form-title {
      font-size: 15px;
      font-weight: 600;
      letter-spacing: 0.5px;
      margin: 0 30px 12px 0;
      position: relative;
      color: #333;
    }

    #floating-form .form-title::after {
      content: '';
      position: absolute;
      left: 0;
      bottom: -4px;
      width: 178px;
      height: 2px;
      background: linear-gradient(to right, #FC7D91, #FCA07E);
      border-radius: 2px;
    }

    #closeFormBtn, #minimizeFormBtn {
      position: absolute;
      top: 6px;
      width: 24px;
      height: 24px;
      background: transparent;
      border: none;
      font-size: 18px;
      cursor: pointer;
      color: #aaa;
    }

    #closeFormBtn:hover, #minimizeFormBtn:hover {
      color: #333;
    }

    #closeFormBtn {
      right: 10px;
    }

    #minimizeFormBtn {
      right: 38px;
    }

    #floating-form.minimized {
      height: auto;
      width: 260px;
      overflow: hidden;
    }

    #floating-form.minimized > *:not(.form-title):not(#closeFormBtn):not(#minimizeFormBtn) {
      display: none !important;
    }

    #floating-form label {
      display: block;
      font-size: 11px;
      margin-bottom: 3px;
      margin-top: 8px;
      color: #444;
    }

    #floating-form input {
      width: 100%;
      padding: 6px;
      box-sizing: border-box;
      border: 1px solid #ccc;
      border-radius: 4px;
      margin-bottom: 2px;
      font-size: 13px;
      background: #f9f9f9;
    }

    .color-input-wrapper {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 5px;
    }

    .color-preview {
      width: 20px;
      height: 20px;
      border: 1px solid #ccc;
      border-radius: 3px;
    }

    .number-input-wrapper {
      display: flex;
      gap: 4px;
      align-items: center;
      margin-bottom: 5px;
    }

    .number-input-wrapper input {
      flex: 1;
    }

    .number-input-wrapper button {
      width: 26px;
      height: 26px;
      background: #eee;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 16px;
      font-weight: bold;
      color: black;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.3s, color 0.3s;
    }

    .number-input-wrapper button:hover {
      background: #FC7D91 !important;
      color: white;
      border-color: #FC7D91;
    }

    #button-row {
      display: flex;
      gap: 8px;
      margin-top: 12px;
    }

    #button-row button {
      flex: 1;
      padding: 6px;
      background: #FC7D91;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background 0.3s;
      font-size: 13px;
    }

    #button-row button:disabled {
      background: #ddd;
      cursor: not-allowed;
      color: #888;
    }

    #button-row button:hover:not(:disabled) {
      background: #e7667c;
    }
	
	.hint {
      font-size: 10px;
      color: #777;
      margin: 1px 0 6px 0;
    }
  `;
  document.head.appendChild(style);
  document.body.appendChild(testStyle);

  const form = document.createElement('div');
  form.id = 'floating-form';
  form.innerHTML = `
    <div class="form-title">CuSStard :: Create Demo</div>
    <button id="minimizeFormBtn" title="Minimize">−</button>
    <button id="closeFormBtn" title="Close">×</button>

    <label for="email">Your Email</label>
    <input type="email" id="email" required />

    <label for="brandName">Prospect (brand) Name</label>
    <input type="text" id="brandName" required />

    <label for="logoUrl">Brand Logo URL</label>
    <input type="url" id="logoUrl" required />

    <label for="bgUrl">Background Image URL</label>
    <input type="url" id="bgUrl" required />

    <label for="primaryColor">Primary Brand Colour (eg. #FA798E)</label>
    <div class="color-input-wrapper">
      <input type="text" id="primaryColor" required />
      <div id="primaryPreview" class="color-preview"></div>
    </div>

    <label for="secondaryColor">Secondary Brand Colour (eg. #61B7AE)</label>
    <div class="color-input-wrapper">
      <input type="text" id="secondaryColor" required />
      <div id="secondaryPreview" class="color-preview"></div>
    </div>

    <label for="bgVertical">Background Image Vertical Position</label>
    <div class="number-input-wrapper">
      <button type="button" onclick="document.getElementById('bgVertical').stepDown()">−</button>
      <input type="number" id="bgVertical" value="0" required />
      <button type="button" onclick="document.getElementById('bgVertical').stepUp()">+</button>
    </div>

    <label for="linkedinUrl">LinkedIn Company Page URL</label>
    <input type="url" id="linkedinUrl" placeholder="eg. https://www.linkedin.com/company/staffbase/"/>

    <label for="languageLocales">Required Language Locales (Comma Separated, POSIX)</label>
    <input type="text" id="languageLocales" placeholder="eg. en_US, de_DE, ja_JP" />
	<div class="hint">Leave empty for default English, German, Japanese</div>

    <div id="button-row">
      <button type="button" id="testBtn" disabled>Test</button>
      <button type="button" id="createBtn" disabled>Create</button>
    </div>
  `;
  document.body.appendChild(form);

  const requiredInputs = [
    'email', 'brandName', 'logoUrl', 'bgUrl',
    'primaryColor', 'secondaryColor', 'bgVertical'
  ].map(id => document.getElementById(id));

  const testBtn = document.getElementById('testBtn');
  const createBtn = document.getElementById('createBtn');

  function isHex(value) {
    return /^#([0-9A-F]{3}){1,2}$/i.test(value);
  }

  function validateAllFields() {
    let isValid = true;
    requiredInputs.forEach(input => {
      const value = input.value.trim();
      const valid = input.id.includes('Color') ? isHex(value) : value !== '';
      input.style.borderColor = valid ? '#ccc' : 'red';
      if (!valid) isValid = false;
    });
    testBtn.disabled = createBtn.disabled = !isValid;
  }

  requiredInputs.forEach(input => {
    input.addEventListener('input', validateAllFields);
  });

  function updateColorPreview(inputId, previewId) {
    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewId);
    input.addEventListener('input', () => {
      const value = input.value.trim();
      preview.style.backgroundColor = isHex(value) ? value : 'transparent';
    });
  }

  updateColorPreview('primaryColor', 'primaryPreview');
  updateColorPreview('secondaryColor', 'secondaryPreview');

  createBtn.addEventListener('click', async () => {
    const data = {
      email: email.value.trim(),
      brandName: brandName.value.trim(),
      logoUrl: logoUrl.value.trim(),
      bgUrl: bgUrl.value.trim(),
      primaryColor: primaryColor.value.trim(),
      secondaryColor: secondaryColor.value.trim(),
      bgVertical: bgVertical.value.trim(),
      linkedinUrl: linkedinUrl.value.trim(),
      languageLocales: languageLocales.value.trim(),
      slugName: cusstard.slugName
    };

    try {
      fetch("https://script.google.com/macros/s/AKfycbyGxYmd5lYmwQhFbgpsqeuNgQnFjszFS7btXbTwlZZbhfAh3vAZsygejSBpGr-kqWfY/exec", {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain'
        },
        body: JSON.stringify(data)
      });

      alert('Starting to prepare your tasty demo! Check your inbox in a few minutes!');
      form.querySelectorAll('input').forEach(input => {
        input.value = input.defaultValue || '';
      });
      document.getElementById('primaryPreview').style.backgroundColor = 'transparent';
      document.getElementById('secondaryPreview').style.backgroundColor = 'transparent';
      validateAllFields();
    } catch (err) {
      console.error(err);
      alert('Error creating demo: ' + err.message);
    }
  });

  testBtn.addEventListener('click', () => {
    const data = {
      email: email.value.trim(),
      brandName: brandName.value.trim(),
      logoUrl: logoUrl.value.trim(),
      bgUrl: bgUrl.value.trim(),
      primaryColor: primaryColor.value.trim(),
      secondaryColor: secondaryColor.value.trim(),
      bgVertical: bgVertical.value.trim(),
      linkedinUrl: linkedinUrl.value.trim(),
      languageLocales: languageLocales.value.trim()
    };
    testStyle.textContent = cssTemplate
      .replace(/%%COLOUR_PRIMARY%%/g, data.primaryColor)
      .replace(/%%COLOUR_SECONDARY%%/g, data.secondaryColor)
      .replace(/%%BG_IMAGE%%/g, data.bgUrl)
      .replace(/%%LOGO_URL%%/g, data.logoUrl)
      .replace(/%%BG_IMG_POS%%/g, data.bgVertical);

    const existing = document.getElementById('test-style-message');
    if (existing) existing.remove();

    const msg = document.createElement('div');
    msg.id = 'test-style-message';
    msg.textContent = 'Test style injected!';
    Object.assign(msg.style, {
      position: 'fixed',
      bottom: '10px',
      left: '10px',
      background: 'yellow',
      padding: '6px 12px',
      fontWeight: 'bold',
      borderRadius: '5px',
      boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
      zIndex: 9999,
      fontFamily: 'Arial, sans-serif'
    });
    document.body.appendChild(msg);
    setTimeout(() => msg.remove(), 8000);
  });

  document.getElementById('closeFormBtn').addEventListener('click', () => {
    form.remove();
  });

  document.getElementById('minimizeFormBtn').addEventListener('click', () => {
    form.classList.toggle('minimized');
  });

  let isDragging = false, offsetX, offsetY;
  form.addEventListener('mousedown', (e) => {
    if (!e.target.closest('.form-title')) return;
    isDragging = true;
    offsetX = e.clientX - form.offsetLeft;
    offsetY = e.clientY - form.offsetTop;
    form.style.cursor = 'grabbing';
  });
  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    form.style.left = `${e.clientX - offsetX}px`;
    form.style.top = `${e.clientY - offsetY}px`;
    form.style.bottom = 'auto';
    form.style.right = 'auto';
  });
  document.addEventListener('mouseup', () => {
    isDragging = false;
    form.style.cursor = 'move';
  });
})();
