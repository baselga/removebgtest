// @ts-nocheck

export const isFileSystemSupported = !!window?.showOpenFilePicker

export async function requestLoadFile() {
  /** @type {FileSystemFileHandle[]} */
  const [fileHandle] = await window.showOpenFilePicker()
  return fileHandle
}

/**
 * @param {string} data
 */
export async function requestSaveFileAs(data) {
  /** @type {FileSystemFileHandle} */
  const fileHandle = await window.showSaveFilePicker()

  const fileWriter = await fileHandle.createWritable()
  await fileWriter.write(data)
  await fileWriter.close()

  return fileHandle
}

/**
 * @param {FileSystemFileHandle} fileHandle
 */
export async function readFile(fileHandle) {
  const file = await fileHandle.getFile()
  const fileContents = await file.text()
  return fileContents
}

/**
 * @param {FileSystemFileHandle} fileHandle
 * @param {string} data
 */
export async function writeFile(fileHandle, data) {
  const fileWriter = await fileHandle.createWritable()
  await fileWriter.write(data)
  fileWriter.close()
}