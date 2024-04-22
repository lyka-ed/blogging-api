const multer = require("multer");

// Setting storage location
const Storage = multer.diskStorage({
  destination: "blogImages",
  filename: (req, file, cb) => {
    cb(
      null,
      new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname
    );
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const blogImages = multer({
  storage: Storage,
  fileFilter: fileFilter,
});

const fileSizeConverter = (bytes, decimalPlaces) => {
  if (bytes === 0) {
    return "0 Bytes";
  }

  const dP = decimalPlaces || 2;
  const storageSizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const index = Math.floor(Math.log(bytes) / Math.log(1024));

  const calculatedSize = parseFloat(
    (bytes / Math.pow(1024, index)).toFixed(dP) + " " + storageSizes[index]
  );

  const sizeAndMemory = calculatedSize + " " + storageSizes[index];

  return sizeAndMemory;
};

module.exports = { blogImages, fileSizeConverter };
