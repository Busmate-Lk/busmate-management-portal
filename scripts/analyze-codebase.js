#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, '../src');

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  gray: '\x1b[90m',
};

// File extensions to include
const includedExtensions = ['.ts', '.tsx', '.js', '.jsx', '.css', '.scss'];

// Statistics tracker
const stats = {
  totalFiles: 0,
  totalLines: 0,
  totalCodeLines: 0,
  totalCommentLines: 0,
  totalBlankLines: 0,
  byExtension: {},
  byDirectory: {},
};

/**
 * Count lines in a file
 * Returns { total, code, comments, blank }
 */
function countLines(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    
    let totalLines = lines.length;
    let commentLines = 0;
    let blankLines = 0;
    let inBlockComment = false;

    for (const line of lines) {
      const trimmed = line.trim();
      
      if (trimmed === '') {
        blankLines++;
      } else if (trimmed.startsWith('//')) {
        commentLines++;
      } else if (trimmed.startsWith('/*')) {
        inBlockComment = true;
        commentLines++;
      }
      
      if (inBlockComment) {
        if (trimmed.includes('*/')) {
          inBlockComment = false;
        }
      }
    }

    const codeLines = totalLines - commentLines - blankLines;

    return {
      total: totalLines,
      code: codeLines > 0 ? codeLines : 0,
      comments: commentLines,
      blank: blankLines,
    };
  } catch (error) {
    return { total: 0, code: 0, comments: 0, blank: 0 };
  }
}

/**
 * Recursively walk through directory
 */
function walkDir(dirPath, relativePath = '') {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    const relPath = relativePath ? `${relativePath}/${entry.name}` : entry.name;

    if (entry.isDirectory()) {
      // Skip node_modules and hidden directories
      if (entry.name === 'node_modules' || entry.name.startsWith('.')) {
        continue;
      }
      walkDir(fullPath, relPath);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name);
      
      if (includedExtensions.includes(ext)) {
        stats.totalFiles++;

        // Count lines
        const lineCounts = countLines(fullPath);
        stats.totalLines += lineCounts.total;
        stats.totalCodeLines += lineCounts.code;
        stats.totalCommentLines += lineCounts.comments;
        stats.totalBlankLines += lineCounts.blank;

        // Track by extension
        if (!stats.byExtension[ext]) {
          stats.byExtension[ext] = {
            files: 0,
            lines: 0,
            codeLines: 0,
          };
        }
        stats.byExtension[ext].files++;
        stats.byExtension[ext].lines += lineCounts.total;
        stats.byExtension[ext].codeLines += lineCounts.code;

        // Track by directory
        const dir = path.dirname(relPath) || 'root';
        if (!stats.byDirectory[dir]) {
          stats.byDirectory[dir] = {
            files: 0,
            lines: 0,
            codeLines: 0,
          };
        }
        stats.byDirectory[dir].files++;
        stats.byDirectory[dir].lines += lineCounts.total;
        stats.byDirectory[dir].codeLines += lineCounts.code;
      }
    }
  }
}

/**
 * Format number with commas
 */
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Print header
 */
function printHeader(text) {
  console.log(
    `\n${colors.bright}${colors.cyan}${'='.repeat(60)}${colors.reset}`
  );
  console.log(`${colors.bright}${colors.cyan}${text}${colors.reset}`);
  console.log(
    `${colors.bright}${colors.cyan}${'='.repeat(60)}${colors.reset}\n`
  );
}

/**
 * Main execution
 */
function analyze() {
  console.log(`${colors.bright}${colors.blue}📊 Analyzing codebase...${colors.reset}\n`);

  walkDir(srcPath);

  // Print results
  printHeader('📈 CODEBASE OVERVIEW');

  console.log(`${colors.green}✓ Total Files:${colors.reset} ${formatNumber(stats.totalFiles)}`);
  console.log(`${colors.green}✓ Total Lines:${colors.reset} ${formatNumber(stats.totalLines)}`);
  console.log(`${colors.green}✓ Code Lines:${colors.reset} ${formatNumber(stats.totalCodeLines)} (${((stats.totalCodeLines / stats.totalLines) * 100).toFixed(1)}%)`);
  console.log(`${colors.green}✓ Comment Lines:${colors.reset} ${formatNumber(stats.totalCommentLines)} (${((stats.totalCommentLines / stats.totalLines) * 100).toFixed(1)}%)`);
  console.log(`${colors.green}✓ Blank Lines:${colors.reset} ${formatNumber(stats.totalBlankLines)} (${((stats.totalBlankLines / stats.totalLines) * 100).toFixed(1)}%)`);

  // Print by file type
  printHeader('📄 BREAKDOWN BY FILE TYPE');

  const sortedExtensions = Object.entries(stats.byExtension)
    .sort((a, b) => b[1].codeLines - a[1].codeLines);

  console.log(
    `${colors.bright}${colors.yellow}File Type${colors.reset.padEnd(15)} | ` +
    `${colors.bright}${colors.yellow}Files${colors.reset.padEnd(8)} | ` +
    `${colors.bright}${colors.yellow}Lines${colors.reset.padEnd(10)} | ` +
    `${colors.bright}${colors.yellow}Code Lines${colors.reset.padEnd(12)}`
  );
  console.log('-'.repeat(55));

  for (const [ext, data] of sortedExtensions) {
    const extDisplay = ext.padEnd(15);
    const filesDisplay = data.files.toString().padEnd(8);
    const linesDisplay = formatNumber(data.lines).padEnd(10);
    const codeDisplay = formatNumber(data.codeLines).padEnd(12);

    console.log(
      `${colors.cyan}${extDisplay}${colors.reset} | ${filesDisplay} | ${linesDisplay} | ${codeDisplay}`
    );
  }

  // Print by directory
  printHeader('📁 BREAKDOWN BY DIRECTORY');

  const sortedDirs = Object.entries(stats.byDirectory)
    .sort((a, b) => b[1].codeLines - a[1].codeLines);

  console.log(
    `${colors.bright}${colors.yellow}Directory${colors.reset.padEnd(35)} | ` +
    `${colors.bright}${colors.yellow}Files${colors.reset.padEnd(8)} | ` +
    `${colors.bright}${colors.yellow}Code Lines${colors.reset.padEnd(12)}`
  );
  console.log('-'.repeat(65));

  for (const [dir, data] of sortedDirs) {
    const dirDisplay = dir.padEnd(35);
    const filesDisplay = data.files.toString().padEnd(8);
    const codeDisplay = formatNumber(data.codeLines).padEnd(12);

    console.log(
      `${colors.magenta}${dirDisplay}${colors.reset} | ${filesDisplay} | ${codeDisplay}`
    );
  }

  // Print summary statistics
  printHeader('📊 SUMMARY STATISTICS');

  const avgLinesPerFile = Math.round(stats.totalCodeLines / stats.totalFiles);
  const avgCodeDensity = ((stats.totalCodeLines / stats.totalLines) * 100).toFixed(1);

  console.log(`${colors.green}✓ Average Lines per File:${colors.reset} ${formatNumber(avgLinesPerFile)}`);
  console.log(`${colors.green}✓ Code Density:${colors.reset} ${avgCodeDensity}%`);
  console.log(`${colors.green}✓ File Types:${colors.reset} ${sortedExtensions.length}`);
  console.log(`${colors.green}✓ Directories:${colors.reset} ${sortedDirs.length}`);

  console.log(`\n${colors.bright}${colors.green}✅ Analysis complete!${colors.reset}\n`);
}

// Run analysis
if (fs.existsSync(srcPath)) {
  analyze();
} else {
  console.error(`${colors.bright}${colors.yellow}⚠️  src directory not found at: ${srcPath}${colors.reset}`);
  process.exit(1);
}
