/**
 * generate_icons.js
 *
 * Utility script to (re)generate monochrome PNG icon assets from Font Awesome
 * definitions so the static site does not depend on the FA runtime in the
 * browser. Run manually whenever you add / change icons:
 *
 *   node generate_icons.js
 *
 * Output: ./assets/icons/*.png
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { icon } = require('@fortawesome/fontawesome-svg-core');
const {
  faChartLine,
  faLaptopCode,
  faHistory,
  faShieldHalved,
  faChartPie,
  faUsers,
  faBullseye,
} = require('@fortawesome/free-solid-svg-icons');
const { faDiscord, faGithub, faTwitter } = require('@fortawesome/free-brands-svg-icons');

/**
 * Map of logical icon keys to Font Awesome definitions and output file names.
 * Extend this object to add new exported PNG icons.
 */
const icons = {
  realTime: { definition: faChartLine, file: 'real_time.png' },
  botBuilder: { definition: faLaptopCode, file: 'bot_builder.png' },
  backtesting: { definition: faHistory, file: 'backtesting.png' },
  risk: { definition: faShieldHalved, file: 'risk_management.png' },
  analytics: { definition: faChartPie, file: 'analytics.png' },
  community: { definition: faUsers, file: 'community.png' },
  bull: { definition: faBullseye, file: 'bull.png' },
  discord: { definition: faDiscord, file: 'discord.png' },
  github: { definition: faGithub, file: 'github.png' },
  twitter: { definition: faTwitter, file: 'twitter.png' },
};

/**
 * Generates all PNG icons (idempotent).
 * 1. Renders the FA SVG in memory
 * 2. Converts SVG -> PNG via sharp
 * 3. Writes to /assets/icons
 */
async function generate() {
  const outDir = path.join(__dirname, 'assets', 'icons');
  fs.mkdirSync(outDir, { recursive: true });
  for (const key of Object.keys(icons)) {
    const { definition, file } = icons[key];
    const svgString = icon(definition, { styles: { color: '#00d68f' } }).html.join('');
    const pngBuffer = await sharp(Buffer.from(svgString)).png().toBuffer();
    fs.writeFileSync(path.join(outDir, file), pngBuffer);
    console.log(`Generated ${file}`);
  }
}

generate().catch((err) => {
  console.error(err);
});