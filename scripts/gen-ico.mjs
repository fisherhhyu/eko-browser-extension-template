import Jimp from "jimp";
import toIco from "to-ico";
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, "..");
const publicDir = resolve(projectRoot, "public");
const outIco = resolve(publicDir, "icon.ico");

async function createIco() {
  const size = 128;
  // 背景：白色
  const image = new Jimp(size, size, 0xffffffff);

  const font = await Jimp.loadFont(Jimp.FONT_SANS_64_BLACK);

  // 居中绘制 “TSAFo”
  image.print(
    font,
    0,
    0,
    {
      text: "TSAFo",
      alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
      alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
    },
    size,
    size
  );

  // 轻微抗锯齿/锐化处理（可选）
  image.quality(100);

  // 转 PNG -> ICO
  const pngBuffer = await image.getBufferAsync(Jimp.MIME_PNG);
  const icoBuffer = await toIco([pngBuffer]);

  await writeFile(outIco, icoBuffer);
  console.log("ICO 生成完成:", outIco);
}

createIco().catch((err) => {
  console.error("生成 ICO 失败:", err);
  process.exit(1);
});