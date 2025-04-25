import unzipper from "unzipper";
import fs from "fs";
import path from "path";

export const upload = async (file, projectId, projectName, res) => {
  const zipFilePath = file.path;
  const fileNameWithoutExt = path.basename(file.originalname, path.extname(file.originalname));
  const extractPath = path.join("/app/games", fileNameWithoutExt);
  console.log(file.path, "file path");
  const extractPath = path.join("/app/games", `${projectId}`);

  try {
    fs.mkdirSync(extractPath, { recursive: true });

    fs.createReadStream(zipFilePath)
      .pipe(unzipper.Parse())
      .on("entry", (entry) => {
        let relativePath = entry.path;

  
        if (relativePath.startsWith("dist/")) {
          relativePath = relativePath.replace(/^dist\//, "");
        }

        const targetPath = path.join(extractPath, relativePath);

        if (entry.type === "File") {
          fs.mkdirSync(path.dirname(targetPath), { recursive: true });
          entry.pipe(fs.createWriteStream(targetPath));
        } else {
          entry.autodrain();
        }
      })
      .on("close", () => {
        fs.unlink(zipFilePath, (err) => {
          if (err) console.error("Error deleting zip:", err);
        });
      })
      .on("error", (err) => {
        console.error("Unzip error:", err);
        res.status(500).json({ message: err.message });
      });

  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: err.message });
  }
};
