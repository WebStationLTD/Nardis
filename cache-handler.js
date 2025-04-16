// cache-handler.js
const { mkdir, writeFile, readFile, stat } = require("fs/promises");
const { existsSync } = require("fs");
const path = require("path");

// Проста имплементация на кеш хендлър
// За реална употреба, би могла да бъде разширена с Redis или друга кеш система
module.exports = class CacheHandler {
  constructor(options) {
    this.options = {
      maxAge: 5 * 60 * 1000, // 5 минути по подразбиране
      ...options,
    };
    this.cache = new Map();
    this.cacheDir = path.join(process.cwd(), ".next/cache");
  }

  async get(key) {
    // Проверка в паметта първо
    if (this.cache.has(key)) {
      const item = this.cache.get(key);
      const now = Date.now();
      if (now - item.timestamp < this.options.maxAge) {
        return item.data;
      }
      this.cache.delete(key);
    }

    // Проверка на диска
    try {
      const filePath = this.getFilePath(key);
      if (!existsSync(filePath)) return null;

      const fileStats = await stat(filePath);
      const now = Date.now();
      if (now - fileStats.mtimeMs < this.options.maxAge) {
        const data = await readFile(filePath, "utf8");
        const parsed = JSON.parse(data);
        this.cache.set(key, { data: parsed, timestamp: now });
        return parsed;
      }
    } catch (error) {
      console.error("Грешка при извличане от кеша:", error);
    }
    return null;
  }

  async set(key, data) {
    // Запис в паметта
    this.cache.set(key, { data, timestamp: Date.now() });

    // Запис на диска
    try {
      const filePath = this.getFilePath(key);
      const dir = path.dirname(filePath);
      await mkdir(dir, { recursive: true });
      await writeFile(filePath, JSON.stringify(data), "utf8");
    } catch (error) {
      console.error("Грешка при запис в кеша:", error);
    }
  }

  getFilePath(key) {
    // Създаваме име на файл от ключа
    const hash = Buffer.from(key)
      .toString("base64")
      .replace(/[\/\+\=]/g, "_");
    return path.join(this.cacheDir, hash.substring(0, 2), `${hash}.json`);
  }
};
