import { WorkerAction, IDict } from '../types';

function loadFile(payload: {
  fileName: string;
  content: string;
}): IDict | null {
  const str = `data:application/octet-stream;base64,${payload.content}`;
  fetch(str)
    .then(b => b.arrayBuffer())
    .then(buff => console.log('buff', buff /* just for a view purpose */))
    .catch(e => console.log(e));
  return { content: '' };
}

let WorkerHandler: {
  [key in WorkerAction]: (payload: any) => any;
} = {} as any;
WorkerHandler[WorkerAction.LOAD_FILE] = loadFile;

export default WorkerHandler;
