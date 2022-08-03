const SocketIO = require("socket.io");

module.exports = (server) => {
    const io = SocketIO(server, { path: "/socket.io" });
    //index.html의 path와 동일하게

    io.on("connection", (socket) => {
        const req = socket.request;
        const ip = req.headers["x-forward-for"] || req.socket.remoteAddress;
        console.log(
            `New Client : ${ip}, socket.id : ${socket.id}`
        );

        socket.on("disconnect", () => {
            console.log(`Client Out : ${ip}, socket.id : ${socket.id}`);
            clearInterval(socket.interval);
        });

        socket.on("error", (error) => { });

        socket.on("from client", (data) => {
            console.log(data);
        });

        socket.interval = setInterval(() => {
            socket.emit("from server", "Message From Server");
        }, 3000);
    });
};