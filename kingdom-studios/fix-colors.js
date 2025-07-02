// Fix script for RefinersFireScreen color updates
const fs = require('fs');

const filePath = 'c:\\Users\\dezme\\Kingdom Studios App\\kingdom-studios\\src\\screens\\RefinersFireScreen.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Map old colors to new colors
const colorMap = {
  'KingdomColors.gray600': 'KingdomColors.text.muted',
  'KingdomColors.gray400': 'KingdomColors.text.muted',
  'KingdomColors.gray800': 'KingdomColors.text.primary',
  'KingdomColors.success': 'KingdomColors.accent.success',
  'KingdomColors.gold': 'KingdomColors.gold.bright',
  'backgroundColor: KingdomColors.gold': 'backgroundColor: KingdomColors.gold.bright',
  'color: KingdomColors.gold': 'color: KingdomColors.gold.bright',
  'KingdomColors.white': 'KingdomColors.text.primary',
  'KingdomColors.lightGray': 'KingdomColors.text.secondary'
};

// Replace all color references
Object.keys(colorMap).forEach(oldColor => {
  content = content.replace(new RegExp(oldColor.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), colorMap[oldColor]);
});

fs.writeFileSync(filePath, content);
console.log('Color updates applied to RefinersFireScreen.tsx');
