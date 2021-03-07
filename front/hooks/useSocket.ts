import io from 'socket.io-client';
import { useCallback } from 'react';

const backUrl = 'http://localhost:3095';
// io.connect return 값의 타입이 SocketIOClient.Socket이다.
// key : workspace?
const sockets: { [key: string]: SocketIOClient.Socket } = {};

//socket.io connect, disconnect hook (workspace)
const useSocket = (workspace?: string): [SocketIOClient.Socket | undefined, () => void] => {
  const disconnect = useCallback(() => {
    if (workspace && sockets[workspace]) {
      sockets[workspace].disconnect;
      delete sockets[workspace];
    }
  }, [workspace]);

  if (!workspace) {
    return [undefined, disconnect];
  }
  if (!sockets[workspace]) {
    sockets[workspace] = io.connect(`${backUrl}/ws-${workspace}`, { transports: ['websocket'] });
    console.info('create socket', workspace, sockets[workspace]);
  }

  return [sockets[workspace], disconnect];
};

export default useSocket;

//   emit으로 보내고 on으로 받는다.
//   sockets[workspace] = io.connect(`${backUrl}`);
//   서버쪽에 hello 이벤트 명으로 world(데이터)를 보낸다
//   sockets[workspace].emit('hello', 'world');
//   이벤트 리스너
//   sockets[workspace].on('message', (data) => {
//     console.log(data);
//   });
//   sockets[workspace].on('onlineList', (data) => {
//     console.log(data);
//   });
//   한번 맺은 소켓연결을 끝는다.
