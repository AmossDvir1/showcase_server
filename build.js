const esbuild = require('esbuild')

esbuild.build({
  entryPoints: ['./src/index.ts'],
  bundle: true,
  minify: true,
  platform: 'node',
  target: 'node20',
  outfile: 'dist/index.js',
//   format: 'esm',
  external: [
    // Add external packages that shouldn't be bundled
    'express',
    'mongodb',
    'mongoose',
    'bcrypt',
    'jsonwebtoken',
    'nodemailer',
    'passport',
    'sharp',
    'ws',
    'socket.io'
  ]
})
.catch((err) => {console.error(err);process.exit(1)})
