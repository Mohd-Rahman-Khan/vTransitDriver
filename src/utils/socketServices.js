import { io } from "socket.io-client";
import { API_BASE_URL } from "../config/urls";

class WSServices {
  initializeSocket = async () => {
    try {
      this.socket = io(API_BASE_URL, { path: "/api/socket.io/" });
      console.log("initializeSocket", this.socket);

      this.socket.on("connect", (data) => {
        console.log("socket connect", data);
      });

      this.socket.on("disconnect", (data) => {
        console.log("socket disconnect", data);
      });

      this.socket.on("error", (error) => {
        console.log("socket error", error);
      });
    } catch {
      console.log("socket is not initialized", error);
    }
  };

  emit(event, data = {}) {
    this.socket.emit(event, data);
  }

  on(event, callBack) {
    this.socket.on(event, callBack);
  }

  removeListener(listenerName) {
    this.socket.removeListener(listenerName);
  }
}

const socketServices = new WSServices();

export default socketServices;
