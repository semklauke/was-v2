import Transport from 'winston-transport';
import util from 'util';
import { Server } from 'socket.io';

module.exports = class ServerLogTransport extends Transport {
  socketio: Server;

  constructor(opts: any) {
    super(opts);
    this.socketio = opts.io;
  }

  log(info: any, callback: () => void) {
    setImmediate(() => {
      this.emit('logged', info);
    });
    console.log(info)
    console.log(callback)
    //this.socketio.to("console").emit(info)

    callback();
  }
};