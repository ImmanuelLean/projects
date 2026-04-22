// ============================================
// FILE UPLOADS — MULTER & CLOUD STORAGE
// ============================================
// npm install multer sharp

// ---- 1. BASIC MULTER SETUP ----

const basicSetup = `
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();

// ===== Disk Storage (save to filesystem) =====
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueName + ext);
  },
});

// ===== File Filter =====
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, GIF, and WebP images are allowed'), false);
  }
};

// ===== Multer Instance =====
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,  // 5MB max
    files: 5,                    // max 5 files
  },
});
`;

// ---- 2. UPLOAD ROUTES ----

const uploadRoutes = `
// ===== Single File Upload =====
app.post('/api/upload/avatar',
  upload.single('avatar'),    // field name in form
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    res.json({
      message: 'Avatar uploaded',
      file: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
        path: req.file.path,
        url: \`/uploads/\${req.file.filename}\`,
      },
    });
  }
);

// ===== Multiple Files =====
app.post('/api/upload/gallery',
  upload.array('photos', 10),  // field name, max count
  (req, res) => {
    const files = req.files.map(f => ({
      filename: f.filename,
      size: f.size,
      url: \`/uploads/\${f.filename}\`,
    }));
    res.json({ message: \`\${files.length} files uploaded\`, files });
  }
);

// ===== Multiple Fields =====
app.post('/api/upload/product',
  upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'gallery', maxCount: 5 },
  ]),
  (req, res) => {
    const thumbnail = req.files['thumbnail']?.[0];
    const gallery = req.files['gallery'] || [];
    res.json({
      thumbnail: thumbnail?.filename,
      gallery: gallery.map(f => f.filename),
    });
  }
);

// ===== Serve uploaded files =====
app.use('/uploads', express.static('uploads'));
`;

// ---- 3. MEMORY STORAGE + IMAGE PROCESSING ----

const imageProcessing = `
const sharp = require('sharp');

// Memory storage (no disk write, process in memory)
const memoryUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter,
});

app.post('/api/upload/optimized',
  memoryUpload.single('image'),
  async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file' });

    const filename = Date.now() + '.webp';
    const outputPath = path.join('uploads', filename);

    // Process with Sharp
    await sharp(req.file.buffer)
      .resize(800, 600, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(outputPath);

    // Generate thumbnail
    const thumbFilename = 'thumb_' + filename;
    await sharp(req.file.buffer)
      .resize(200, 200, { fit: 'cover' })
      .webp({ quality: 60 })
      .toFile(path.join('uploads', thumbFilename));

    res.json({
      image: \`/uploads/\${filename}\`,
      thumbnail: \`/uploads/\${thumbFilename}\`,
    });
  }
);
`;

// ---- 4. CLOUD STORAGE (S3 Pattern) ----

const cloudStorage = `
// npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner

const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { v4: uuidv4 } = require('uuid');

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET = process.env.S3_BUCKET;

// ===== Upload to S3 =====
async function uploadToS3(file) {
  const key = \`uploads/\${uuidv4()}-\${file.originalname}\`;

  await s3.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  }));

  return {
    key,
    url: \`https://\${BUCKET}.s3.amazonaws.com/\${key}\`,
  };
}

// ===== Pre-signed URL (direct upload from browser) =====
async function getUploadUrl(filename, contentType) {
  const key = \`uploads/\${uuidv4()}-\${filename}\`;

  const url = await getSignedUrl(s3, new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    ContentType: contentType,
  }), { expiresIn: 300 });  // 5 minutes

  return { uploadUrl: url, key };
}

// ===== Route: Get pre-signed upload URL =====
app.post('/api/upload/presigned', async (req, res) => {
  const { filename, contentType } = req.body;
  const { uploadUrl, key } = await getUploadUrl(filename, contentType);
  res.json({ uploadUrl, key });
});

// ===== Delete from S3 =====
async function deleteFromS3(key) {
  await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
}
`;

// ---- 5. FRONTEND UPLOAD COMPONENT ----

const frontendUpload = `
// React component for file upload
function FileUpload({ onUpload }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const handleSelect = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    // Validate client-side
    if (selected.size > 5 * 1024 * 1024) {
      alert('File too large (max 5MB)');
      return;
    }
    if (!selected.type.startsWith('image/')) {
      alert('Only images allowed');
      return;
    }

    setFile(selected);

    // Preview
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(selected);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch('/api/upload/optimized', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      onUpload?.(data);
    } catch (err) {
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  // Drag and drop
  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleSelect({ target: { files: [droppedFile] } });
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      style={{ border: '2px dashed #ccc', padding: 20, textAlign: 'center' }}
    >
      <input type="file" accept="image/*" onChange={handleSelect} />
      {preview && <img src={preview} alt="Preview" style={{ maxWidth: 200 }} />}
      {file && <p>{file.name} ({(file.size / 1024).toFixed(1)} KB)</p>}
      <button onClick={handleUpload} disabled={!file || uploading}>
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
    </div>
  );
}
`;

// ---- 6. ERROR HANDLING ----

const errorHandling = `
// Multer error handling middleware
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    const messages = {
      LIMIT_FILE_SIZE: 'File too large',
      LIMIT_FILE_COUNT: 'Too many files',
      LIMIT_UNEXPECTED_FILE: 'Unexpected field name',
    };
    return res.status(400).json({
      error: messages[err.code] || err.message,
    });
  }
  if (err.message.includes('Only')) {
    return res.status(400).json({ error: err.message });
  }
  next(err);
});
`;

console.log("=== File Uploads Summary ===");
console.log(`
  Multer:
    .single('field')    — One file
    .array('field', n)  — Multiple files, one field
    .fields([...])      — Multiple fields

  Storage:
    diskStorage         — Save to filesystem
    memoryStorage       — Process in memory (Sharp)
    S3/Cloud            — Production storage

  Best Practices:
    Validate file type and size (client + server)
    Generate unique filenames
    Process images (resize, compress, WebP)
    Use pre-signed URLs for direct-to-cloud uploads
    Clean up orphaned files
`);
