import express from "express";
import cors from "cors";
import httpd from "http";
import { Server as socketIO } from "socket.io";
import path from "path";
import fs from "fs";

const app = express();
const http = httpd.createServer(app);
const io = new socketIO(http);
const __dirname = path.resolve();

app.use(express.static(path.join(__dirname, "../public")));
app.use(cors());

app.get("/", (req, res) => {
    res.sendFile("index.html");
});

io.on("connect", (client) => {
    console.log(`Client connected [id=${client.id}]`);
    client.emit("server_setup", `Server connected [id=${client.id}]`);

    client.on("message", async function (data) {
        const dataURL = data.audio.dataURL.split(",").pop();
        let fileBuffer = Buffer.from(dataURL, "base64");
        fs.writeFile("hello.wav", fileBuffer, (err) => {
            if (err) throw err;
            console.log("Saved!");
        });
        client.emit("results", "HELLO");
    });
});

http.listen(3000, () => {
    console.log("listening on *:3000");
});
