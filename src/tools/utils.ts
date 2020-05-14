// Copyright (c) Trung Le
// Distributed under the terms of the Modified BSD License.

//@ts-ignore
import readPolyDataArrayBuffer from "itk/readPolyDataArrayBuffer";

export const majorAxis = (vec3: Array<number>, idxA: number, idxB: number) => {
  const axis = [0, 0, 0];
  const idx = Math.abs(vec3[idxA]) > Math.abs(vec3[idxB]) ? idxA : idxB;
  const value = vec3[idx] > 0 ? 1 : -1;
  axis[idx] = value;
  return axis;
};

export const resultPreprocessor = ({ webWorker, polyData }: any) => {
  webWorker.terminate();
  return polyData;
};

export const getFileExt = (fileName: string) => {
  let a = fileName.split(".");
  if (a.length === 1 || (a[0] === "" && a.length === 2)) {
    return "";
  }
  const ext = a.pop();
  if (ext) {
    return ext.toLowerCase();
  } else {
    return "";
  }
};

export  function parserFile(fileName: string, fileContents: any) {
  let data =  readPolyDataArrayBuffer(null, fileContents, fileName)
    .then(resultPreprocessor)
    .then((polyData: any) => polyData);
  return data;
}

export const readFile = (file) => {
  return new Promise((resolve, reject) => {
    var reader = new FileReader();
    reader.onload = function (e) {
      resolve(reader.result);
    };
    reader.onerror = reader.onabort = reject;
    reader.readAsArrayBuffer(file);
  });
};

export async function processFile(file) {
  try {
    let contentBuffer = await readFile(file);
    return parserFile(file.name as string, contentBuffer);
  } catch (err) {
    console.log(err);
  }
}
