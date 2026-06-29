const fs = require('fs');
const path = require('path');
const dir = 'c:/Users/Excalıbur/Desktop/berbereskisehir_vip_system/berber-app/components/sections';
const files = fs.readdirSync(dir);
files.forEach(file => {
  if (file.endsWith('.tsx')) {
    let content = fs.readFileSync(path.join(dir, file), 'utf8');
    // Replace <h2 className="text-[42px]..." with <h2 className="reveal-title section-title text-[42px]..."
    // and replace <h2 className="reveal-item text-[42px]..." with <h2 className="reveal-title section-title text-[42px]..."
    let updated = false;
    
    const newContent = content.replace(/<h2 className="(?!.*reveal-title)(reveal-item\s*)?(.*?)"/g, (match, p1, p2) => {
      updated = true;
      return `<h2 className="reveal-title section-title ${p2}"`;
    });

    if (updated && content !== newContent) {
      fs.writeFileSync(path.join(dir, file), newContent);
      console.log(`Updated ${file}`);
    }
  }
});
