import { Server } from 'socket.io';
import http from 'http';

class SocketIO {
  private io: Server;

  constructor(server: http.Server) {
    this.io = new Server(server);
    this.middlewares();
    this.setupWebSocket();
  }

  private middlewares(): void {
    this.io.use(async (socket, next) => {
      try {
        console.log('socket.handshake.query => ', socket.handshake.query);
        next();
      } catch (e: any) {
        next(new Error(e?.message));
      }
    });
  }

  private setupWebSocket(): void {
    this.io.on('connection', (socket) => {
      console.log('user connect => ' + socket.id);

      socket.on('disconnect', () => {
        console.log('user disconnect => ' + socket.id);
      });

      socket.on('message', (message) => {
        console.log({ message });
        socket.emit('message', 'message Received: ' + message);
      });

      socket.use(([event, ...args], next) => {
        next();
      });
    });
  }

  public triggerUserUpdate(userId: string) {
    const id = userId.toString();
    this.io.emit(`updateUser-${id}`, '');
  }

  public triggerNotifyUser(userId: string) {
    const id = userId.toString();
    this.io.emit(`notify-${id}`, '');
  }

  public triggerNotifyAdmin() {
    this.io.emit(`adminNotify`, '');
  }

  public totalOnlineUsers() {
    return this.io.engine.clientsCount;
  }

  public triggerProductsFetch() {
    this.io.emit('fetchProducts', '');
  }


  public pageSettingUpdate(){
    this.io.emit('pageSettingUpdate',null)
  }

  public assetsSettingUpdate(){
    this.io.emit('assestSettingsChange',null)
  }


}

export default SocketIO;
