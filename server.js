const express = require('express');
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use('/files', express.static(path.join(__dirname, 'uploads')));

// Cria pasta de uploads se não existir
if (!fs.existsSync('./uploads')) fs.mkdirSync('./uploads');

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const id = crypto.randomBytes(8).toString('hex');
    const ext = path.extname(file.originalname);
    cb(null, `${id}${ext}`);
  }
});

const upload = multer({ storage });

app.post('/upload', upload.single('zipfile'), (req, res) => {
  const filename = req.file.filename;
  const downloadUrl = `${req.protocol}://${req.get('host')}/files/${filename}`;
  res.json({ url: downloadUrl });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
