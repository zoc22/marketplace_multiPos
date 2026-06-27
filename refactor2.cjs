const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const componentsDir = path.join(__dirname, 'src', 'components');
const layoutsDir = path.join(__dirname, 'src', 'layouts');

const replacements = [
  // App.vue & PublicLayout.vue specifics
  { regex: /bg-slate-950 text-slate-100/g, replace: 'bg-light-bg-main dark:bg-slate-950 text-text-main dark:text-slate-100' },
  
  // Standard hex replacements
  { regex: /bg-\[#F8F7F4\]/g, replace: 'bg-light-bg-main' },
  { regex: /bg-\[#FFFFFF\]/gi, replace: 'bg-light-bg-main' },
  { regex: /bg-white/g, replace: 'bg-light-bg-main' },
  { regex: /bg-\[#F0EFEB\]/g, replace: 'bg-light-bg-sec' },
  { regex: /border-\[#F0EFEB\]/g, replace: 'border-divider' },
  { regex: /text-\[#1A1A1A\]/gi, replace: 'text-text-main' },
  { regex: /text-\[#4A4A4A\]/gi, replace: 'text-text-sec' },
  { regex: /text-\[#7A7A7A\]/gi, replace: 'text-text-sec' },
  
  // Buttons and Accents
  { regex: /bg-amber-500/g, replace: 'bg-button-orange' },
  { regex: /hover:bg-amber-400/g, replace: 'hover:bg-button-orange\\/90' },
  { regex: /text-amber-500/g, replace: 'text-button-orange' },
  { regex: /border-amber-500/g, replace: 'border-button-orange' },
  { regex: /bg-emerald-400/g, replace: 'bg-accent-green' },
  { regex: /bg-emerald-500/g, replace: 'bg-accent-green' },
  { regex: /text-emerald-400/g, replace: 'text-accent-green' },
  { regex: /text-emerald-500/g, replace: 'text-accent-green' },
  { regex: /border-emerald-400/g, replace: 'border-accent-green' },
  { regex: /border-emerald-500/g, replace: 'border-accent-green' },

  // Additional variants found in components
  { regex: /text-amber-600/g, replace: 'text-button-orange' },
  { regex: /text-emerald-600/g, replace: 'text-accent-green' },
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let newContent = content;
  
  // For App.vue and PublicLayout.vue ONLY apply the specific bg-slate-950 replacement
  if (filePath.endsWith('App.vue') || filePath.endsWith('PublicLayout.vue')) {
      newContent = newContent.replace(/bg-slate-950 text-slate-100/g, 'bg-light-bg-main dark:bg-slate-950 text-text-main dark:text-slate-100');
  }

  for (const rule of replacements) {
    if (rule.regex.source === 'bg-slate-950 text-slate-100') continue;
    newContent = newContent.replace(rule.regex, rule.replace);
  }
  
  if (newContent !== content) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Updated: ${path.basename(filePath)}`);
  }
}

// Target specific files
const filesToProcess = [
  path.join(srcDir, 'App.vue'),
  path.join(layoutsDir, 'PublicLayout.vue'),
  path.join(componentsDir, 'PublicHeader.vue'),
  path.join(componentsDir, 'PublicFooter.vue'),
  path.join(componentsDir, 'ConfirmationModal.vue'),
  path.join(componentsDir, 'Pagination.vue'),
  path.join(componentsDir, 'SkeletonLoader.vue')
];

for (const file of filesToProcess) {
  if (fs.existsSync(file)) {
    processFile(file);
  }
}

console.log("Components Refactoring complete.");
