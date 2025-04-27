import conf from "@/conf/conf";
import { io } from "socket.io-client";

export const createSocketConnection = () => {
    return io(conf.backendUrl);
}