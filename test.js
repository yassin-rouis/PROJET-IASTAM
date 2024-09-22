const convert2xkt = require("@xeokit/xeokit-convert/dist/convert2xkt.cjs").convert2xkt;
const fs = require('fs');
const WebIFC = require("web-ifc");



convert2xkt({
    WebIFC,
    sourceFormat: "ifc",
    sourceData: fs.readFileSync("./data/haus.ifc"),
    outputXKT: (xtkArrayBuffer) => {
        fs.writeFileSync("./data/haus.ifc.xkt", xtkArrayBuffer);
    }
}).then(() => {
    console.log("Converted.");
}, (errMsg) => {
    console.error("Conversion failed: " + errMsg)
});
