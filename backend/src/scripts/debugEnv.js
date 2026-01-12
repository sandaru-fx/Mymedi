const dotenv = require('dotenv');
const path = require('path');
const config = dotenv.config({ path: path.join(__dirname, '../../.env') });

console.log('DEBUG PORT:', process.env.PORT || 'undefined (using default)');
console.log('Parsed:', config.parsed);
