export class GameSocket {
  constructor() {
    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    this.socket = new WebSocket(`${protocol}://${window.location.host}/ws`);
  }

  onMessage(handler) {
    this.socket.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      handler(msg);
    };
  }

  onOpen(handler) {
    this.socket.onopen = handler;
  }

  onClose(handler) {
    this.socket.onclose = handler;
  }

  send(type, payload = {}) {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ type, ...payload }));
    }
  }

  close() {
    this.socket.close();
  }
}