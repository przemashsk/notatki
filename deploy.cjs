const FtpDeploy = require("ftp-deploy");
const ftpDeploy = new FtpDeploy();
// const path = require('path');

const config = {
    user: "marketingwiked",
    password: "Obrazwik321",
    host: "cloudserver2082088.home.pl",
    port: 21,
    localRoot: __dirname + "/dist",
    remoteRoot: "/public_html/pbarthelke/",
    include: ["**/*", ".*"],
    exclude: [
        "**/*.map",
        "node_modules/**",
        ".git/**",
    ],
    deleteRemote: false,
    forcePasv: true,
    sftp: false,
};

ftpDeploy.on("uploaded", data => {
    console.log("Uploaded:", data.filename);
});


ftpDeploy
    .deploy(config)
    .then((res) => console.log("finished:", res))
    .catch((err) => console.log(err));