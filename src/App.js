import {useEffect, useState} from "react";
import {IfcViewerAPI} from "web-ifc-viewer";
import {MeshLambertMaterial, Color} from 'three';
import {Button, Form} from "react-bulma-components";


const {Input} = Form;

import "./main.css";
import {ArrowLeft, Broadcast, CaretLeft, CaretRight, FileCode, FileDoc} from "phosphor-react";
import io from "socket.io-client";
import {ChangeEvent} from "react";

let socket = io("http://raspberrypi.local:3000/");

socket.on("connect", function() {
    console.log("connect")
    setTimeout(() => {
        socket.emit("login", "12345678")
    }, 1000)
})

export default function App() {

    let [viewType, setViewType] = useState(0);
    let [sensors, setSensors] = useState({});
    let [selected, setSelected] = useState({expressID: -1, Name: {value: "Aucun bloc sélectionné", type: null}});
    let [filename, setFilename] = useState("Aucun fichier");
    let [selectedSensor, setSelectedSensor] = useState("");
    let [model, setModel] = useState({});
    let [activeSensors, setActiveSensors] = useState({});
    let [file, setFile] = useState(null);
    let [url, setUrl] = useState("");

    async function fileChange(event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files[0];
        const url = URL.createObjectURL(file);
        setUrl(url)

        setFile(file);

        setFilename(file.name);

        //setModel(await ifcLoader.open(file));

        await viewer.IFC.loadIfcUrl(url);
    }

    function download() {
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;

        a.click();
    }

    useEffect(() => {
        socket.on("data", (data) => {
            setSensors(data);
        })

        const container = document.getElementById('ifc-viewer');
        const viewer = new IfcViewerAPI({container});

        viewer.axes.setAxes();
        viewer.grid.setGrid();

        viewer.IFC.loader.ifcManager.setWasmPath("../../static/")
        window.viewer = viewer

        container.onmousemove = () => viewer.IFC.selector.prePickIfcItem();

        container.onclick = async (event) => {
            const result = await viewer.IFC.selector.pickIfcItem();
            if (result) {
                const newColor = new Color(0x00FF00);
                const newMaterial = new MeshLambertMaterial({
                    color: newColor, transparent: true, opacity: 1.0
                });

                window.picked = result;

                console.log('Objet IFC cliqué:', result);
                const modelID = result.modelID;
                const expressID = result.id;

                const properties = await viewer.IFC.getProperties(modelID, expressID, true, false);
                console.log('Propriétés de l\'objet :', properties);
                setSelected(properties)
            }
        };
    }, []);


    return <>
        <div id="main-container">
            <div id="main" style={{width: (viewType < 0 ? "0%" : "100%")}}>
                <div className={"logos"}>
                    <img className={"logo"} src="./static/logo-eps.svg" alt="LOGO IEEE EPS"/>
                    <img className={"logo"} src="./static/logo-ias.webp" alt="LOGO IAS"/>
                    <img className={"logo"} src="./static/logo-iastam.jpg" alt="LOGO IASTAM"/>
                    <img className={"logo"} src="./static/logo-data.jpg" alt="LOGO DATAVERSE"/>
                </div>
                <div className="space"></div>
                <div className="file has-name">
                    <label className="file-label">
                        <input className="file-input" type="file" name="resume" accept={".ifc"}
                               onChange={fileChange}/>
                        <span className="file-cta">
                            <span className="file-icon">
                                <FileCode/>
                            </span>
                            <span className="file-label"> Choisir un fichier… </span>
                        </span>
                        <span className="file-name"> {filename} </span>
                    </label>
                    <div>&nbsp;</div>
                    <Button color={"link"} onClick={download}>Snapshot</Button>
                </div>
                <div id={"main-content"}>
                    <div className="sensors">
                        {Object.keys(sensors).map(k => {
                            return <div className={"sensor"} onClick={() => {setSelectedSensor(k)}} style={{
                                backgroundColor: (selectedSensor===k? "#ffb03a" : null)
                            }}>
                                <Broadcast weight={"duotone"} size={32}/>
                                <div className="name">
                                    {k.toUpperCase()}
                                </div>
                                <div className={"value"}>
                                    {Math.round(sensors[k] * 1000) / 1000}
                                </div>
                            </div>
                        })}
                    </div>
                    <div className={"separator"}></div>
                    <div id={"linker"}>
                        <span className="linker-title">
                            <span className="element-title">
                                {selected.Name.value}
                            </span>
                            <span>
                                ({selected.constructor.name}#{selected.expressID})
                            </span>
                        </span>
                        <div className="separator"></div>
                        {activeSensors[selected.Name.value]?.map(s => {
                            return <div className={"live-sensor"}>
                                {s.toUpperCase()} = { sensors[s] }
                            </div>
                        })}
                        <div className="separator"></div>

                        <Button.Group hasAddons={true}>
                            <Button color={"link"} onClick={() => {
                                let copyActiveSensors = activeSensors;
                                if(copyActiveSensors.hasOwnProperty(selected.Name.value)) {
                                    if(!copyActiveSensors[selected.Name.value].includes(selectedSensor)) copyActiveSensors[selected.Name.value].push(selectedSensor)
                                } else {
                                    copyActiveSensors[selected.Name.value] = [selectedSensor]
                                }
                                setActiveSensors(copyActiveSensors)
                            }
                            }>Link</Button>
                            <Button color={"danger"} outlined={true} onClick={() => {
                                let copyActiveSensors = activeSensors;
                                copyActiveSensors[selected.Name.value] = []
                                setActiveSensors(copyActiveSensors)
                            }}>Unlink</Button>
                        </Button.Group>
                    </div>
                </div>
            </div>
            <div id="view-controller">
                <button style={{opacity: (viewType > 0 ? 0.5 : 1)}} onClick={() => {
                    if (viewType < 1) setViewType(viewType + 1);
                }}>
                    <CaretRight weight={"duotone"} size={30}/>
                </button>
                <button style={{opacity: (viewType < 0 ? 0.5 : 1)}} onClick={() => {
                    if (viewType > -1) setViewType(viewType - 1);
                }}>
                    <CaretLeft weight={"duotone"} size={30}/>
                </button>
            </div>
            <div id="viewer-container" style={{width: (viewType > 0 ? "0%" : "100%")}}>
                <div id={"ifc-viewer"}>

                </div>
            </div>
        </div>
    </>
}