javascript:(function() {
  var button = document.createElement('button');
  button.textContent = 'Open File';
  button.style.backgroundColor = 'rgb(64,65,79)';
  button.style.color = 'white';
  button.style.border = '1px solid rgba(32,33,35,.5)';
  button.style.borderRadius = '.375rem';
  button.style.width = '15%';
  button.style.position = 'absolute';
  button.style.bottom = '0';
  button.style.right = '0';
  button.style.height = '50px';
  button.style.shadow = '[0_0_15px_rgba(0,0,0,0.10)]';
  
  button.onmouseover = function() {
    button.style.backgroundColor = 'rgb(32,33,35)';
  };
  button.onmouseout = function() {
    button.style.backgroundColor = 'rgb(64,65,79)';
  };
  
  var targetElement = document.querySelector('.flex.flex-col.w-full.py-2.flex-grow.md\\:py-3.md\\:pl-4');
  targetElement.parentNode.appendChild(button);
  targetElement.style.width = 'calc(100% - 15% - 1%)';
  button.addEventListener('click', function() {
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt,.js,.py,.html,.css,.json,.csv,.java,.svg';
    input.addEventListener('change', async function(event) {
      var file = event.target.files[0];
      var filename = file.name;
      var reader = new FileReader();
      var fileSize = file.size;
      var chunkSize = 15000;
      var offset = 0;
      var part = 1;
      var numChunks = Math.ceil(fileSize / chunkSize);
      window.globalNumChunks = numChunks;
      while (offset < fileSize) {
        var chunk = file.slice(offset, offset + chunkSize);
        var text = await new Promise((resolve, reject) => {
          reader.onload = function(event) {
            resolve(event.target.result);
          };
          reader.onerror = function(event) {
            reject(event.target.error);
          };
          reader.readAsText(chunk);
        });
        await submitConversation(text, part, filename);
        var chatgptReady = false;
        while (!chatgptReady) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          chatgptReady = !document.querySelector('.text-2xl > span:not(.invisible)');
          if (chatgptReady) {
            button.textContent = 'Open File';
            button.disabled = false;
            button.style.cursor = 'pointer';
          }
        }
        offset += chunkSize;
        part++;
      }
    });
    input.click();
  });
  async function submitConversation(text, part, filename) {
    const textarea = document.querySelector("textarea[tabindex='0']");
    const enterKeyEvent = new KeyboardEvent("keydown", {
      bubbles: true,
      cancelable: true,
      keyCode: 13,
    });
    button.style.cursor = 'not-allowed';
    button.style.backgroundColor = 'rgb(64,65,79)';
    button.textContent = `${part}/${window.globalNumChunks}`;
    button.disabled = true;
    textarea.value = `Part ${part} of ${filename}:\n\n${text}`;
    textarea.dispatchEvent(enterKeyEvent);
  }})();
