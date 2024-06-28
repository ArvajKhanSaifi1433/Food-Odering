import multer from "multer";

// localFilePath return karta hai
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp"); // Set the destination folder where files will be stored
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Define the filename format
  },
});

export const upload = multer({ storage: storage });
