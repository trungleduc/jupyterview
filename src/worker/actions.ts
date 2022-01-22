import { WorkerAction, IDict } from '../types';
import readPolyDataArrayBuffer from 'itk/readPolyDataArrayBuffer';
//@ts-ignore
self.window = self;

async function loadFile(payload: {
  fileName: string;
  content: string;
}): Promise<IDict> {
  console.log(payload.fileName);

  const str = `data:application/octet-stream;base64,${payload.content}`;
  const buffer = await fetch(str);
  const data = await readPolyDataArrayBuffer(
    null,
    buffer.arrayBuffer(),
    'temp.vtu'
  );
  return { content: data };
}

let WorkerHandler: {
  [key in WorkerAction]: (payload: any) => any;
} = {} as any;
WorkerHandler[WorkerAction.LOAD_FILE] = loadFile;

export default WorkerHandler;
