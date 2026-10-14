// Renders public/images/logo.png (dark text, for schema/social use) and favicon.png from the logo design.
import sharp from 'sharp';
const drop = `<path d="M24 3C15 15 5 27 5 39a19 19 0 0 0 38 0C43 27 33 15 24 3z" fill="#1B65A6"/><polyline points="15,40 22,47 34,33" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 268 64">${drop}<text x="56" y="26" fill="#1B65A6" font-family="Poppins, Arial, sans-serif" font-weight="700" font-size="17" textLength="150" lengthAdjust="spacing">LANCASTER</text><text x="55" y="58" fill="#222" font-family="Poppins, Arial Black, Arial, sans-serif" font-weight="800" font-size="21" textLength="208" lengthAdjust="spacingAndGlyphs">SEPTIC SERVICE</text></svg>`;
await sharp(Buffer.from(svg), { density: 300 }).resize({ width: 800 }).png().toFile('public/images/logo.png');
const fav = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 64"><rect width="48" height="64" rx="8" fill="#111"/><g transform="translate(0,4)">${drop.replace('#1B65A6', '#3B9AE1')}</g></svg>`;
await sharp(Buffer.from(fav), { density: 300 }).resize({ width: 64 }).png().toFile('public/favicon.png');
console.log('logo.png + favicon.png done');
