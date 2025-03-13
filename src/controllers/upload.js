import unzipper from "unzipper";
import fs from "fs";
import path from "path";

export const upload = async (req, res) => {
  const zipFile = req.file;
  console.log(zipFile);

  const zipFilePath = zipFile.path;
  // // console.log(zipFilePath);

  const extractPath = path.join(
    path.dirname(zipFilePath),
    zipFile.originalname.replace(".zip", "")
  );
  // console.log(extractPath);

  try {
    fs.mkdirSync(extractPath);
  } catch (err) {
    throw err;
  }

  fs.createReadStream(zipFilePath)
    .pipe(unzipper.Extract({ path: extractPath }))
    .on("finish", () => {
      // console.log("inside");

      res.json({ message: "Zip file extracted successfully" });
    })
    .on("error", (err) => {
      res
        .status(500)
        .json({ message: "Error extracting zip file", error: err });
    });
};
