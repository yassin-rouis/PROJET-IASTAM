import {useEffect} from "react";
import { IfcViewerAPI } from 'web-ifc-viewer/dist/ifc-viewer-api';

export default function App() {
    useEffect(() => {
        const container = document.getElementById('viewer-container');
        const viewer = new IfcViewerAPI({ container });
        viewer.axes.setAxes();
        viewer.grid.setGrid();

        async function loadIfc(url) {
            await viewer.IFC.loadIfcUrl(url);
        }

        // Exemple pour charger un fichier .IFC local ou distant
        loadIfc('/haus_test.ifc');
    }, []);
    return <>
        <div id="viewer-container">

        </div>
    </>
}