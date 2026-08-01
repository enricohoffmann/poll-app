const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, 'dist/poll-app/browser');
const assetsSourcePath = path.join(__dirname, 'public/assets');
const assetsDestPath = path.join(distPath, 'assets');

// Function to replace /assets/ with relative assets/ path
function replaceAssetsInFiles(filePath) {
    let content = fs.readFileSync(filePath, 'utf-8');
    let hasChanges = false;
    
    // Replace absolute /assets/ paths with relative assets/ paths
    // This way Angular's base-href will handle the routing automatically
    if (content.includes('url(/assets/')) {
        content = content.replace(/url\(\/assets\//g, 'url(assets/');
        hasChanges = true;
    }
    if (content.includes('url("/assets/')) {
        content = content.replace(/url\("\/assets\//g, 'url("assets/');
        hasChanges = true;
    }
    if (content.includes("url('/assets/")) {
        content = content.replace(/url\('\/assets\//g, "url('assets/");
        hasChanges = true;
    }
    
    // Also replace in JS strings (for embedded CSS in components)
    // But be careful not to replace paths that don't start with /assets/
    if (content.includes('/assets/')) {
        content = content.replace(/\/assets\//g, 'assets/');
        hasChanges = true;
    }
    
    if (hasChanges) {
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`✓ Updated asset paths: ${path.basename(filePath)}`);
    }
}

// Copy assets folder to dist
function copyAssetsFolder(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }
    
    const files = fs.readdirSync(src);
    files.forEach(file => {
        const srcPath = path.join(src, file);
        const destPath = path.join(dest, file);
        
        if (fs.statSync(srcPath).isDirectory()) {
            copyAssetsFolder(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    });
}

// Main execution
if (fs.existsSync(distPath)) {
    // Copy assets folder
    if (fs.existsSync(assetsSourcePath)) {
        copyAssetsFolder(assetsSourcePath, assetsDestPath);
        console.log('✓ Copied assets folder');
    } else {
        console.warn(`Warning: Assets source not found at ${assetsSourcePath}`);
    }
    
    // Update all CSS and JS files with asset references
    const files = fs.readdirSync(distPath);
    files.forEach(file => {
        if (file.endsWith('.css') || file.endsWith('.js')) {
            replaceAssetsInFiles(path.join(distPath, file));
        }
    });
    
    console.log('\n=== DEPLOYMENT FOR MULTI-PROJECT SERVER ===');
    console.log('✓ All files ready in: dist/poll-app/browser/');
    console.log('✓ Assets included in: dist/poll-app/browser/assets/');
    console.log('✓ Asset paths rewritten to relative: assets/...');
    console.log('\nDeploy Instructions:');
    console.log('1. Upload entire folder to server: /poll-app/');
    console.log('2. Structure on server will be:');
    console.log('   /poll-app/');
    console.log('   ├── index.html');
    console.log('   ├── assets/');
    console.log('   │   ├── fonts/');
    console.log('   │   ├── icons/');
    console.log('   │   └── img/');
    console.log('   └── (other files)');
    console.log('\nResult: app runs at https://yourserver.com/poll-app/');
    console.log('=============================================\n');
} else {
    console.error(`Dist path not found: ${distPath}`);
    process.exit(1);
}



