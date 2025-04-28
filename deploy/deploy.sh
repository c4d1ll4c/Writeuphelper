#!/bin/bash

# The Toolbox Deployment Script for SiteGround
echo "🧰 Preparing The Toolbox for SiteGround deployment..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install --production

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf .next out siteground

# Create static export for SiteGround
echo "🏗️ Creating static export for SiteGround..."
npm run siteground-deploy

# Copy .htaccess file to the SiteGround folder
echo "📄 Adding .htaccess file..."
cp .htaccess siteground/

# Optimize images
echo "🖼️ Optimizing images..."
find siteground -type f -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" -o -name "*.gif" | xargs -P 8 -I {} bash -c 'echo "Optimizing {}"; [[ "{}" == *.png ]] && pngquant --force --quality=65-80 --skip-if-larger --strip --verbose "{}" --output "{}" || jpegoptim --strip-all --max=85 "{}"' 2>/dev/null || echo "Image optimization tools not found, skipping..."

# Minify HTML files
echo "📄 Minifying HTML files..."
find siteground -type f -name "*.html" | xargs -P 8 -I {} bash -c 'echo "Minifying {}"; cat {} | tr -d "\n\t" | sed "s/  //g" > {}.tmp && mv {}.tmp {}' || echo "HTML minification failed, skipping..."

echo "✅ Build complete! The application is ready for SiteGround deployment."
echo ""
echo "To deploy to SiteGround:"
echo "1. Log in to your SiteGround account"
echo "2. Navigate to Site Tools > Site > FTP"
echo "3. Create FTP credentials if you haven't already"
echo "4. Use an FTP client (like FileZilla) to upload the contents of the 'siteground' folder"
echo "5. Upload to the public_html directory (or your chosen subdirectory)"
echo ""
echo "If you have SSH access, you can run these commands on your SiteGround server:"
echo "cd ~/public_html"
echo "rm -rf *  # Be careful with this command - it removes all files in the directory"
echo "Then upload the files or use scp to copy them"
echo ""
echo "For more information, visit: https://www.siteground.com/tutorials/getting-started/" 