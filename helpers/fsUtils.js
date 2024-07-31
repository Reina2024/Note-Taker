const fs = require('fs').promises; // Use promises directly for simplicity

/**
 * Function to read data from a file
 * @param {string} filePath The path to the file you want to read from.
 * @returns {Promise<string>} The contents of the file as a string.
 */
const readFromFile = (filePath) => fs.readFile(filePath, 'utf8');

/**
 * Function to write data to a file
 * @param {string} destination The path to the file you want to write to.
 * @param {object} content The content you want to write to the file.
 * @returns {Promise<void>} A promise that resolves when the file has been written.
 */
const writeToFile = (destination, content) => 
  fs.writeFile(destination, JSON.stringify(content, null, 4),'utf8');

/**
 * Function to read data from a file and append content to it
 * @param {object} content The content you want to append to the file.
 * @param {string} file The path to the file you want to append to.
 * @returns {Promise<void>} A promise that resolves when the content has been appended.
 */
const readAndAppend = async (content, file) => {
  try {
    const data = await readFromFile(file);
    const parsedData = JSON.parse(data);
    parsedData.push(content);
    await writeToFile(file, parsedData);
  } catch (err) {
    console.error('Error reading or appending file:', err);
  }
};

module.exports = { readFromFile, writeToFile, readAndAppend };
