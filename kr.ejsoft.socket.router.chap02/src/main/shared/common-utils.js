import { nativeImage } from "electron";

const path = require("path");

class CommonUtils {
    static icon(size) {
        let iconname = "apps.png";
        // iconname = process.platform === "darwin" ? "icon.icns" : iconname;
        iconname = process.platform === "win32" ? "apps.ico" : iconname;
        const iconPath = path.join(__dirname, "..", "..", "..", "static", iconname);
        console.log("__dirname : ", __dirname);
        console.log("iconpath : ", iconPath);

        if(process.platform === "darwin") {
            let icon = nativeImage.createFromPath(iconPath);
            if(size && size > 0) {
                icon = icon.resize({ width: size, height: size });
            }
            return icon;
        }
        return iconPath;
    }
}

export default CommonUtils;
