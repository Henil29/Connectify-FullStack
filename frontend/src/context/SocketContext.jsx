import { useEffect, useContext, createContext, useState } from "react";
import io from "socket.io-client";
import { UserData } from "./UserContext";

const EndPoint = "https://connectify-1opq.onrender.com";
const SocketContext = createContext();

export const SocketContextProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [onlineUsers,setOnlineUsers]=useState([])
    const { user } = UserData()

    useEffect(() => {
        const newSocket = io(EndPoint, {
            query: {
                userId: user?._id,
            }
        });
        setSocket(newSocket);

        newSocket.on("getOnlineUser",(users)=>{
            setOnlineUsers(users)
        })
        return () => newSocket && newSocket.close();
    }, [user?._id]);

    return (
        <SocketContext.Provider value={{ socket,onlineUsers }}>
            {children}
        </SocketContext.Provider>
    );
};

export const SocketData = () => useContext(SocketContext);
