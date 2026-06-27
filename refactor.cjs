const fs = require('fs');
const path = require('path');

const publicPagesDir = path.join(__dirname, 'src', 'pages', 'public');
const mainCssPath = path.join(__dirname, 'src', 'assets', 'styles', 'main.css');
const lightCssPath = path.join(__dirname, 'src', 'assets', 'styles', 'themes', 'light.css');
const darkCssPath = path.join(__dirname, 'src', 'assets', 'styles', 'themes', 'dark.css');
const tailwindConfigPath = path.join(__dirname, 'tailwind.config.js');

// 1. Update tailwind.config.js
let tailwindConfig = fs.readFileSync(tailwindConfigPath, 'utf8');
if (!tailwindConfig.includes('light-bg-main')) {
  const customColors = `
        'light-bg-main': 'rgb(var(--light-bg-main) / <alpha-value>)',
        'light-bg-sec': 'rgb(var(--light-bg-sec) / <alpha-value>)',
        'text-main': 'rgb(var(--text-main) / <alpha-value>)',
        'text-sec': 'rgb(var(--text-sec) / <alpha-value>)',
        'accent-green': 'rgb(var(--accent-green) / <alpha-value>)',
        'button-orange': 'rgb(var(--button-orange) / <alpha-value>)',
        'button-text': 'rgb(var(--button-text) / <alpha-value>)',
        'divider': 'rgb(var(--divider) / <alpha-value>)',
  `;
  tailwindConfig = tailwindConfig.replace(/colors:\s*\{/, `colors: {\n${customColors}`);
  fs.writeFileSync(tailwindConfigPath, tailwindConfig, 'utf8');
}

// 2. Update light.css
let lightCss = fs.readFileSync(lightCssPath, 'utf8');
if (!lightCss.includes('--light-bg-main')) {
  const lightVars = `
  /* Nouvelles Variables Marketplace */
  --light-bg-main: 254 253 251; /* #fefdfb */
  --light-bg-sec: 241 237 232; /* #f1ede8 */
  --text-main: 51 45 41; /* #332d29 */
  --text-sec: 108 96 87; /* #6c6057 */
  --accent-green: 55 208 146; /* #37d092 */
  --button-orange: 255 111 78; /* #ff6f4e */
  --button-text: 255 255 255; /* #ffffff */
  --divider: 223 215 208; /* #dfd7d0 */
  --card-shadow: 0 4px 10px rgba(108, 96, 87, 0.1);
  
  /* Overrides du système de base pour le mode clair */
  --color-background: #fefdfb;
  --color-surface: #fefdfb;
  --color-surface-elevated: #f1ede8;
  --color-text-primary: #332d29;
  --color-text-secondary: #6c6057;
  --color-text-tertiary: #6c6057;
  --color-border: #dfd7d0;
`;
  lightCss = lightCss.replace(/\[data-theme="light"\]\s*\{/, `[data-theme="light"] {\n${lightVars}`);
  fs.writeFileSync(lightCssPath, lightCss, 'utf8');
}

// 3. Update dark.css
let darkCss = fs.readFileSync(darkCssPath, 'utf8');
if (!darkCss.includes('--button-orange')) {
  const darkVars = `
  /* Fallbacks pour les variables marketplace en mode sombre */
  --light-bg-main: 10 10 15; /* bg-[#0a0a0f] */
  --light-bg-sec: 28 28 46; /* bg-[#1c1c2e] */
  --text-main: 255 255 255; /* text-white */
  --text-sec: 184 181 176; /* text-[#b8b5b0] */
  --accent-green: 16 185 129; /* emerald-500 */
  --button-orange: 245 158 11; /* amber-500 */
  --button-text: 26 26 26; /* text-[#1A1A1A] */
  --divider: 255 255 255; /* fallback border, opacity usually applied */
`;
  darkCss = darkCss.replace(/\[data-theme="dark"\]\s*\{/, `[data-theme="dark"] {\n${darkVars}`);
  fs.writeFileSync(darkCssPath, darkCss, 'utf8');
}

// 4. Regex replacements for Vue and CSS files
const replacements = [
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
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let newContent = content;
  for (const rule of replacements) {
    newContent = newContent.replace(rule.regex, rule.replace);
  }
  
  if (newContent !== content) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Updated: ${path.basename(filePath)}`);
  }
}

// Process Vue files
const vueFiles = fs.readdirSync(publicPagesDir).filter(f => f.endsWith('.vue'));
for (const file of vueFiles) {
  processFile(path.join(publicPagesDir, file));
}

// Process main.css
processFile(mainCssPath);

console.log("Refactoring complete.");
