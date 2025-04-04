const fs = require("fs");
const path = require("path");
const exec = require("child_process").exec;

const desktopEntry = `[Desktop Entry]
Name=ElectronApp
Exec=${process.execPath} %u
Type=Application
Terminal=false
MimeType=x-scheme-handler/electron-app;
`;

const desktopPath = path.join(process.env.HOME, ".local/share/applications/electron-app.desktop");
fs.writeFileSync(desktopPath, desktopEntry);
exec(`xdg-mime default electron-app.desktop x-scheme-handler/electron-app`);
console.log("Protocol registered successfully.");
