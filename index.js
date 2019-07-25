const express = require("express");
const app = express();
const router = express.Router();
const path = require("path");
const fileType = require("file-type");
const multer = require("multer");
const fs = require("fs");

const upload = multer({
  dest: "images/",
  fileFilter: (req, file, callback) => {
    if (/\S+\.(jpg|bmp|gif|png)/gi.test(file.originalname)) {
      callback(null, true);
    } else {
      callback(Error("Invalid image file name"), false);
    }
  }
}).single("image");

router.post("/images/upload", (req, res) => {
  upload(req, res, err => {
    if (err) {
      res.status(400).json({ message: err.message });
    } else {
      res.status(200).json({
        message: "Upload image successfully",
        image_path: path.join("images", req.file.filename)
      });
    }
  });
});

router.get("/images/:image_name", (req, res) => {
  const imagePath = path.join(__dirname, "images", req.params.images_name);
  try {
    const buffer = fs.readFileSync(imagePath);
    const mime = fileType(buffer).mime;
    res.writeHead(200, { "Content-Type": mime });
    res.end(buffer, "binary");
  } catch (error) {
    console.log(error.code);
    if (error.code === "ENOENT") {
      res.status(404).json({ message: "No such image file" });
    }
    res.status(500).json({ message: error.message });
  }
});

app.use("/", router);
app.listen(3002, () => {
  console.log("app listening on 3002");
});
