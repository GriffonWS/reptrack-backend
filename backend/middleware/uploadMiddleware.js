import multer from "multer";

// Configure multer with memory storage
const storage = multer.memoryStorage();

// File filter for images only
const fileFilter = (req, file, cb) => {
  console.log("🔍 Multer fileFilter triggered!");
  console.log("📄 Processing file:", file.originalname);
  console.log("📄 MIME type:", file.mimetype);

  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    console.log("✅ File type accepted");
    cb(null, true);
  } else {
    console.log("❌ File type rejected");
    cb(new Error("Invalid file type. Only images are allowed."), false);
  }
};

// Create multer instance
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

export default upload;
