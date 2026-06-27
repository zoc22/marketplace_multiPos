const fs = require('fs');
const path = require('path');

const dir = 'c:/wamp64/www/projetSoutenanceV2.1/src/pages/public';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.vue'));

files.forEach(f => {
  const file = path.join(dir, f);
  let content = fs.readFileSync(file, 'utf8');
  
  // Find <footer ...> ... </footer>
  const footerRegex = /(?:<!--\s*[Ff]ooter\s*-->\s*)?<footer[\s\S]*?<\/footer>/;
  if (footerRegex.test(content) && !content.includes('<PublicFooter />')) {
    content = content.replace(footerRegex, '<!-- FOOTER -->\n    <PublicFooter />');
    
    // Add import statement if it doesn't exist
    if (!content.includes('import PublicFooter')) {
      const scriptRegex = /<script setup>\n?([\s\S]*?)<\/script>/;
      const scriptMatch = content.match(scriptRegex);
      if (scriptMatch) {
        const scriptContent = scriptMatch[1];
        const newScriptContent = `import PublicFooter from '@/components/PublicFooter.vue';\n${scriptContent}`;
        content = content.replace(scriptRegex, `<script setup>\n${newScriptContent}</script>`);
      } else {
        // If there's no script setup
        content += `\n<script setup>\nimport PublicFooter from '@/components/PublicFooter.vue';\n</script>\n`;
      }
    }
    
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated footer in ${f}`);
  }
});
