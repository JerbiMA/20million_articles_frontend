const fs = require('fs');
const src = 'C:\\Users\\USER\\.gemini\\antigravity-ide\\brain\\79b8401f-7614-450f-a479-c3fdf928252a\\.user_uploaded\\media_1793311231613.png';
const dst = 'c:\\Users\\USER\\Desktop\\mriwl\\frontend\\public\\icons\\logo-2m.png';
fs.copyFileSync(src, dst);
console.log('Logo copied successfully');
