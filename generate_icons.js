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

// Map icon names to their definitions and file names
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