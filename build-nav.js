const fs = require('fs');
const path = require('path');

// 定义目录路径
const examplesDir = path.join(__dirname, 'examples');
const outputFile = path.join(__dirname, 'index.html');

// 检查 examples 目录是否存在
if (!fs.existsSync(examplesDir)) {
  console.log('Examples directory does not exist. Skipping navigation build.');
  process.exit(0);
}

// 读取 examples 目录下的所有文件
fs.readdir(examplesDir, (err, files) => {
  if (err) {
    console.error('Error reading examples directory:', err);
    process.exit(1);
  }

  // 过滤出 .html 文件，并排除 index.html 自身（如果存在）
  const htmlFiles = files.filter(file => path.extname(file).toLowerCase() === '.html' && file !== 'index.html');

  // 生成导航页的 HTML 内容
  const navLinks = htmlFiles.map(file => {
    const fileNameWithoutExt = path.basename(file, '.html');
    // 将文件名中的连字符或下划线转换为空格，并首字母大写，作为显示的链接名
    const displayName = fileNameWithoutExt
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
    return `        <li><a href="examples/${file}">${displayName}</a> - <code>${file}</code></li>`;
  }).join('\n');

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reveal.js Examples Navigator</title>
    <style>
        body { font-family: sans-serif; line-height: 1.6; max-width: 800px; margin: 2rem auto; padding: 0 1rem; }
        h1 { color: #333; }
        ul { list-style: none; padding: 0; }
        li { margin-bottom: 0.75rem; padding: 0.5rem; border-left: 4px solid #007acc; background-color: #f5f5f5; }
        a { text-decoration: none; color: #007acc; font-weight: bold; }
        a:hover { text-decoration: underline; }
        code { background-color: #eee; padding: 0.2em 0.4em; border-radius: 3px; margin-left: 0.5em; font-family: monospace; color: #555; }
    </style>
</head>
<body>
    <h1>Reveal.js Examples</h1>
    <p>This page is automatically generated. Here are all the presentation examples found in the <code>examples</code> directory:</p>
    <ul>
${navLinks}
    </ul>
    <hr>
    <p><small>Generated on: ${new Date().toLocaleString()}</small></p>
</body>
</html>`;

  // 将生成的 HTML 写入到根目录的 index.html
  fs.writeFile(outputFile, htmlContent, (err) => {
    if (err) {
      console.error('Error writing index.html:', err);
      process.exit(1);
    }
    console.log(`Navigation index.html successfully generated with ${htmlFiles.length} links.`);
  });
});