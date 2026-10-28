'use strict';
(async () => {
  const configuration = {"data": [{"id": "book-data", "src": "./releases/20261023/data/book-data.json"}], "scripts": [{"src": "./releases/20261023/scripts/script-00.js", "id": null}], "readySelector": "#readerContent"};
  const status = document.getElementById('load-status');
  try {
    // Populate the original JSON data nodes before running any dependent scripts.
    const records = await Promise.all(configuration.data.map(async ({id, src}) => {
      const response = await fetch(src);
      if (!response.ok) throw new Error(`Could not load ${src}: ${response.status}`);
      return {id, value: await response.json()};
    }));
    for (const {id, value} of records) {
      const node = document.createElement('script');
      node.type = 'application/json';
      node.id = id;
      node.textContent = JSON.stringify(value);
      document.body.appendChild(node);
    }
    // Classic scripts preserve the export's initialization and dependency order.
    for (const {src, id} of configuration.scripts) {
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.async = false;
        if (id) script.id = id;
        script.onload = resolve;
        script.onerror = () => reject(new Error(`Could not load ${src}`));
        document.body.appendChild(script);
      });
    }
    if (!document.querySelector(configuration.readySelector)?.children.length) throw new Error('Exhibition did not initialize');
    status?.remove();
    document.documentElement.dataset.exhibitionReady = 'true';
  } catch (error) {
    console.error('Exhibition failed to load', error);
    if (status) {
      status.textContent = '展览暂时未能载入，请检查网络后重试。';
      const retry = document.createElement('button');
      retry.type = 'button';
      retry.textContent = '重新加载';
      retry.addEventListener('click', () => location.reload());
      status.appendChild(retry);
    }
  }
})();
