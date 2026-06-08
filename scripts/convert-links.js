const fs = require('fs');
const path = require('path');

const files = [
  'src/components/SECFilings.tsx',
  'src/components/PressReleaseDetailPage.tsx',
  'src/components/PressRelease.tsx',
  'src/components/Partnership.tsx',
  'src/components/NvidiaRubinDeal.tsx',
  'src/components/NeoCloudzSection.tsx',
  'src/components/NeoCloudz.tsx',
  'src/components/Leadership.tsx',
  'src/components/LayeredInfrastructure.tsx',
  'src/components/InvestorRelations.tsx',
  'src/components/GlobalNetwork.tsx',
  'src/components/FilingDetailPage.tsx',
  'src/components/Colocation.tsx'
];

files.forEach(file => {
  const filePath = path.resolve(__dirname, '..', file);
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');

  // Replace react-router-dom useParams + Link import
  content = content.replace(/import\s+\{\s*useParams\s*,\s*Link\s*\}\s*from\s*['"]react-router-dom['"];?/g, 
    "import { useParams } from 'next/navigation';\nimport Link from 'next/link';");

  // Replace react-router-dom Link import
  content = content.replace(/import\s+\{\s*Link\s*\}\s*from\s*['"]react-router-dom['"];?/g, 
    "import Link from 'next/link';");

  // Replace Link to={...} with Link href={...}
  content = content.replace(/<Link\s+([^>]*?\b)to=(['"\{])/g, '<Link $1href=$2');

  // Also replace any ending tags or other occurrences if needed, but <Link ... to= is the main one.

  // Add "use client" if it doesn't exist, as these interactive/client components use next/navigation or next/link
  if (!content.startsWith('"use client"') && !content.startsWith("'use client'")) {
    content = '"use client";\n\n' + content;
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Converted: ${file}`);
});
