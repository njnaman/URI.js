#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const packageJson = require('./package.json');

console.log(`Building ${packageJson.name} v${packageJson.version}...`);

// Clean previous build
console.log('🧹 Cleaning previous build...');
try {
    fs.rmSync('dist', { recursive: true, force: true });
} catch (err) {
    // Directory doesn't exist, that's fine
}

// Type check
console.log('🔍 Type checking...');
try {
    execSync('npm run type-check', { stdio: 'inherit' });
    console.log('✅ Type check passed');
} catch (err) {
    console.error('❌ Type check failed');
    process.exit(1);
}

// Run tests
console.log('🧪 Running tests...');
try {
    execSync('npm test', { stdio: 'inherit' });
    console.log('✅ Tests passed');
} catch (err) {
    console.error('❌ Tests failed');
    process.exit(1);
}

// Build TypeScript
console.log('🔨 Building TypeScript...');
try {
    execSync('npm run build', { stdio: 'inherit' });
    console.log('✅ TypeScript build completed');
} catch (err) {
    console.error('❌ TypeScript build failed');
    process.exit(1);
}

// Add license header to built files
console.log('📄 Adding license headers...');
const licenseHeader = `/*! ${packageJson.title || packageJson.name} v${packageJson.version} ${packageJson.homepage || ''} */\n/* TypeScript migration of URI.js by ${packageJson.author.name} */\n`;

const distDir = path.join(__dirname, 'dist');
const jsFiles = fs.readdirSync(distDir).filter(file => file.endsWith('.js'));

jsFiles.forEach(file => {
    const filePath = path.join(distDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    if (!content.startsWith('/*!')) {
        fs.writeFileSync(filePath, licenseHeader + content);
    }
});

console.log('🎉 Build completed successfully!');

// Show build statistics
const stats = fs.readdirSync(distDir).map(file => {
    const filePath = path.join(distDir, file);
    const stat = fs.statSync(filePath);
    const sizeKB = (stat.size / 1024).toFixed(2);
    return `  ${file}: ${sizeKB} KB`;
});

console.log('\n📊 Build output:');
console.log(stats.join('\n')); 