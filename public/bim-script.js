import { Viewer } from "@xeokit/xeokit-sdk/viewer/Viewer.js";
import { XKTLoaderPlugin } from "@xeokit/xeokit-sdk/plugins/XKTLoaderPlugin/XKTLoaderPlugin.js";

// Créez une instance du visualiseur
const viewer = new Viewer({
    canvasId: "viewerContainer"
});

// Ajoutez la prise en charge du chargement de fichiers BIM XKT (ou autres formats BIM compatibles)
const xktLoader = new XKTLoaderPlugin(viewer);

// Charger un modèle BIM en utilisant un fichier XKT
xktLoader.load({
    src: "./data/haus.ifc.xkt"
}).then(() => {
    console.log("BIM model loaded successfully!");
});