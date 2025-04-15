import unzipper from "unzipper";
import fs from "fs";
import path from "path";
export const upload = async (file, projectId, projectName, res) => {
  const zipFilePath = file.path;
  console.log(file.path,'file path');
  const extractPath = path.join("/app/games", `${projectId}`);

  try {
    fs.mkdirSync(extractPath, { recursive: true });
    fs.createReadStream(zipFilePath)
      .pipe(unzipper.Extract({ path: extractPath }))
      .on("finish", () => {
        fs.unlink(zipFilePath, (err) => {
          if (err) {
            console.error(err);
          }
        });
      })
      .on("error", (err) => {
        res.status(500).json({ message: err });
      });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};
