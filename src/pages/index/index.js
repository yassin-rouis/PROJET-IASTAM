import {Viewer} from "@xeokit/xeokit-sdk/src/viewer/Viewer.js";
import {XKTLoaderPlugin} from "@xeokit/xeokit-sdk/src/plugins/XKTLoaderPlugin/XKTLoaderPlugin.js";
import {useEffect} from "react";


export default function Index() {
    useEffect(() => {
        const viewer = new Viewer({
            canvasId: "viewerContainer"
        });

        const xktLoader = new XKTLoaderPlugin(viewer);

        xktLoader.load({
            src: "./data/haus.ifc.xkt"
        }).then(() => {
            console.log("BIM model loaded successfully!");
        });
    }, []);

    return <div>
        <canvas id="viewerContainer" style={{
            width: '100%',
            height: '600px',
        }}></canvas>
    </div>
}