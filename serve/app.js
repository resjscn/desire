let ws = require("nodejs-websocket");
const socketPort = 9666
console.log("开始建立socket连接...")
function sendEmail(desire, key) {
    const { SMTPClient } = require('emailjs');
    const emailStr = `${key}发起了一个愿望：${desire}，希望你帮他实现。`;
    let server = new SMTPClient({
        user: "name@163.com", //用户名
        password: "pwd", //授权码不是登陆密码
        host: "smtp.163.com", //主机名
        ssl: true //试用ssl
    });
    server.send({
        text: emailStr, //邮件内容
        from: "name@163.com", //谁发送的
        to: 'name@163.com', //发送给谁的
        subject: "新的愿望" //邮件主题
    }, (err, msg) => {
        err && console.log(err)
    })
}

const server = ws.createServer(function (conn) {
    conn.on('text', function (result) {
        const key = decodeURI(conn.path.replace('/', ''))
        console.log(result, key)
        sendEmail(result, key == 'undefined' ? '' : key)
    })
    conn.on("close", function (code, reason) {
        console.log("关闭连接")
    });
    conn.on("error", function (code, reason) {
        console.log("异常关闭")
    });
})
server.listen(socketPort, '0.0.0.0', () => {
    console.log(`WebSocket建立完毕，正在监听${socketPort}端口！`)
});