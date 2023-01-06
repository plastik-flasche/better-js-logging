const { StringUtil } = require("sussy-util");
const fs = require("fs");
module.exports = class {
    typeLength = 0;
    filePath = "";
    startISO8601;
    logEn;

    constructor(filePath, typeLength) {
        this.startISO8601 = new Date().toISOString();
        while (filePath?.endsWith("/")) {
            filePath = filePath.slice(0, -1);
        }
        this.filePath = filePath + "/" + this.startISO8601 + ".log";
        this.filePath = this.filePath?.replace(/:/g, "-");
        this.typeLength = typeLength;
        fs.mkdir(filePath, { recursive: true }, (err) => {
            if (err) console.debug(err);
        });
    }

    append = (type, ...messages) => {
        const ISO8601 = new Date().toISOString();
        let typeString = "[" + type.toUpperCase() + "]";
        typeString = StringUtil.rpad(typeString, this.typeLength, " ");
        messages.forEach((message, index) => {
            if (message instanceof Error) {
                messages[index] = message.stack.replace(/^Error: /g, "");
            } else if (typeof message !== "string") {
                messages[index] = JSON.stringify(message);
            }
        });
        const message = messages.join(" ");
        let logMessage = `[${ISO8601}] ${typeString} ${message}`;

        fs.appendFile(this.filePath, logMessage + "\n", (err) => {
            if (err) console.debug(err);
        });
    }

    clear = () => {
        fs.writeFile(this.filePath, "", (err) => {
            if (err) console.debug(err);
        });
    }
}