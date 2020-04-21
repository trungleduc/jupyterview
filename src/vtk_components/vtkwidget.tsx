
import React from 'react';

//@ts-ignore
import vtkFullScreenRenderWindow from "vtk.js/Sources/Rendering/Misc/FullScreenRenderWindow";
//@ts-ignore
import vtkActor from "vtk.js/Sources/Rendering/Core/Actor";
//@ts-ignore
import vtkSphereSource from "vtk.js/Sources/Filters/Sources/SphereSource";
//@ts-ignore
import vtkMapper from "vtk.js/Sources/Rendering/Core/Mapper";
//@ts-ignore
import vtkDataArray from "vtk.js/Sources/Common/Core/DataArray";
//@ts-ignore
import vtkColorTransferFunction from "vtk.js/Sources/Rendering/Core/ColorTransferFunction";
//@ts-ignore
import vtkXMLPolyDataReader from "vtk.js/Sources/IO/XML/XMLPolyDataReader";
//@ts-ignore
import vtk from 'vtk.js/Sources/vtk';
import {
  ColorMode,
  ScalarMode,
  //@ts-ignore
} from 'vtk.js/Sources/Rendering/Core/Mapper/Constants';
//@ts-ignore
import vtkColorMaps from 'vtk.js/Sources/Rendering/Core/ColorTransferFunction/ColorMaps';
//@ts-ignore
import vtkOrientationMarkerWidget from 'vtk.js/Sources/Interaction/Widgets/OrientationMarkerWidget';
//@ts-ignore
import vtkAxesActor from 'vtk.js/Sources/Rendering/Core/AxesActor';
//@ts-ignore
import vtkInteractiveOrientationWidget from 'vtk.js/Sources/Widgets/Widgets3D/InteractiveOrientationWidget';
//@ts-ignore
import vtkWidgetManager from 'vtk.js/Sources/Widgets/Core/WidgetManager';
//@ts-ignore
import * as vtkMath from 'vtk.js/Sources/Common/Core/Math';
//@ts-ignore
import readPolyDataArrayBuffer from 'itk/readPolyDataArrayBuffer';



function majorAxis(vec3: Array<number>, idxA: number, idxB: number) {
  const axis = [0, 0, 0];
  const idx = Math.abs(vec3[idxA]) > Math.abs(vec3[idxB]) ? idxA : idxB;
  const value = vec3[idx] > 0 ? 1 : -1;
  axis[idx] = value;
  return axis;
}

const resultPreprocessor =  ({ webWorker , polyData  }: any) => {
  webWorker.terminate();
  return polyData;
};

const getFileExt = (fileName: string) => {
  let a = fileName.split(".");
  if( a.length === 1 || ( a[0] === "" && a.length === 2 ) ) {
      return "";
  } 
  const ext = a.pop()
  if (ext) {
    return ext.toLowerCase(); 
  } else {
    return ""
  }
}

async function parserFile (fileName: string, fileContents: any) {
  let data =  await readPolyDataArrayBuffer(null, fileContents, fileName).then(resultPreprocessor)
    .then((polyData: any) => polyData )
  return data
}


interface StateInterface  { colorOption: Array<{}>, fileList: Array<string> }
interface PropsInterface { inputOpenFileRef: React.RefObject<any>}
export default class VtkWidget extends React.Component<PropsInterface, StateInterface> {

  fullScreenRenderer: any;
  renderer: any;
  source: any;
  renderWindow: any;
  mapper: any;
  container: any;
  dataRange: any;
  activeArray: any;
  lookupTable: any;
  actor: any;
  SUPPORTED_FILE: any
  allSource: {}
  fileData: any
  playing: boolean
  playInterval: any
  interator :any
  constructor(props :any) {
    super(props);
    this.fullScreenRenderer = null;
    this.renderer = null;
    this.source = null
    this.renderWindow = null;
    this.mapper = null
    this.container = React.createRef();
    this.state = { colorOption: [], fileList : [] };
    this.dataRange = null
    this.activeArray = null
    this.lookupTable = null
    this.actor = null
    this.SUPPORTED_FILE = ["vtp", "vtu"]
    this.allSource = {}
    this.fileData = {}
    this.playing = false
    this.playInterval = null
    this.interator = null
  }



  createPipeline = (fileName: string, fileContents :any) => {

    this.lookupTable = vtkColorTransferFunction.newInstance();
    this.mapper = vtkMapper.newInstance({
      interpolateScalarsBeforeMapping: false,
      useLookupTableScalarRange: true,
      lookupTable: this.lookupTable,
      scalarVisibility: false
    });
    
    this.actor = vtkActor.newInstance();
    this.actor.setMapper(this.mapper);
    
    this.lookupTable.onModified(() => {
      this.renderWindow.render();
    });

    readPolyDataArrayBuffer(null, fileContents, fileName).then(resultPreprocessor)
    .then((polyData :any) => {
      this.source = vtk(polyData);

      const scalars = this.source.getPointData().getScalars();
      this.dataRange = [].concat(scalars ? scalars.getRange() : [0, 1]);
      this.activeArray = vtkDataArray;
      if (this.state.colorOption.length === 0) {
        const colorByOptions = this.createComponentSelector()
        this.setState((state : StateInterface) => {
          return {...state,  colorOption: colorByOptions };
        });
      }
      this.mapper.setInputData(this.source);
      this.renderer.addActor(this.actor);
      this.renderer.resetCamera();
      this.renderWindow.render();
    });

  };


  createComponentSelector = () => {
    const pointDataArray = this.source.getPointData().getArrays()
    let option: Array<{}> = [{ value: ":", label: "Solid color" }]
    pointDataArray.forEach((a: any) => {
      let name = a.getName()
      let numberComp = a.getNumberOfComponents()
      option.push({
        label: `(p) ${name} magnitude` ,
        value: `PointData:${name}:-1`
      })
      for (let index = 0; index < numberComp; index++) {
        option.push({
          label: `(p) ${name} ${index}` ,
          value: `PointData:${name}:${index}`
        })
        
      }
    })
    const cellDataArray = this.source.getCellData().getArrays()

    cellDataArray.forEach((a: any) => {
      let name = a.getName()
      let numberComp = a.getNumberOfComponents()
      option.push({
        label: `(p) ${name} magnitude` ,
        value: `CellData:${name}:-1`
      })
      for (let index = 0; index < numberComp; index++) {
        option.push({
          label: `(p) ${name} ${index}` ,
          value: `CellData:${name}:${index}`
        })
        
      }
    })
    return option
  }

  updateColorBy = (event: any) => {
    
    const [location, colorByArrayName, indexValue] = event.target.value.split(':');    
    
    const interpolateScalarsBeforeMapping = location === 'PointData';
    let colorMode = ColorMode.DEFAULT;
    let scalarMode = ScalarMode.DEFAULT;
    const scalarVisibility = location.length > 0;
    if (scalarVisibility) {
      const newArray = this.source[`get${location}`]().getArrayByName(
        colorByArrayName
      );
      
      const selectedComp = parseInt(indexValue);
      this.activeArray = newArray;
      
      const newDataRange: Array<number> = this.activeArray.getRange(selectedComp);
      this.dataRange[0] = newDataRange[0];
      this.dataRange[1] = newDataRange[1];
 
      colorMode = ColorMode.MAP_SCALARS;
      scalarMode =
        location === 'PointData'
          ? ScalarMode.USE_POINT_FIELD_DATA
          : ScalarMode.USE_CELL_FIELD_DATA;

      
      if (this.mapper.getLookupTable()) {
        const lut = this.mapper.getLookupTable();          
        if (selectedComp === -1) { 
          lut.setVectorModeToMagnitude();
        } else {
          lut.setVectorModeToComponent()
          lut.setVectorComponent(selectedComp)
        }
      
      } 
    } 
    this.mapper.set({
      colorByArrayName,
      colorMode,
      interpolateScalarsBeforeMapping,
      scalarMode,
      scalarVisibility,
    });
    this.applyPreset();
  }
 
   applyPreset =() => {
    const preset = vtkColorMaps.getPresetByName("rainbow");
    this.lookupTable.applyColorMap(preset);
    this.lookupTable.setMappingRange(this.dataRange[0], this.dataRange[1]);
    this.lookupTable.updateRange();
    }
  
  componentDidMount() {

    setTimeout(() => {
      
      this.fullScreenRenderer = vtkFullScreenRenderWindow.newInstance({
        background: [0, 0, 0, 0],
        container: this.container.current,
        rootContainer  : this.container.current
      });
      this.renderer = this.fullScreenRenderer.getRenderer();
      this.renderWindow = this.fullScreenRenderer.getRenderWindow();

      const axes = vtkAxesActor.newInstance();
      const orientationWidget = vtkOrientationMarkerWidget.newInstance({
        actor: axes,
        interactor: this.renderWindow.getInteractor(),
      });
      orientationWidget.setEnabled(true);
      orientationWidget.setViewportCorner(
        vtkOrientationMarkerWidget.Corners.BOTTOM_LEFT
      );
      orientationWidget.setViewportSize(0.15);
      orientationWidget.setMinPixelSize(100);
      orientationWidget.setMaxPixelSize(300);
      
      const camera = this.renderer.getActiveCamera();
      const widgetManager = vtkWidgetManager.newInstance();
      widgetManager.setRenderer(orientationWidget.getRenderer());
      
      const widget = vtkInteractiveOrientationWidget.newInstance();
      widget.placeWidget(axes.getBounds());
      widget.setBounds(axes.getBounds());
      widget.setPlaceFactor(1);
      
      const vw = widgetManager.addWidget(widget);
      
      // Manage user interaction
      vw.onOrientationChange(({ up , direction, action, event }: any) => {
        const focalPoint = camera.getFocalPoint();
        const position = camera.getPosition();
        const viewUp = camera.getViewUp();
      
        const distance = Math.sqrt(
          vtkMath.distance2BetweenPoints(position, focalPoint)
        );
        camera.setPosition(
          focalPoint[0] + direction[0] * distance,
          focalPoint[1] + direction[1] * distance,
          focalPoint[2] + direction[2] * distance
        );
      
        if (direction[0]) {
          camera.setViewUp(majorAxis(viewUp, 1, 2));
        }
        if (direction[1]) {
          camera.setViewUp(majorAxis(viewUp, 0, 2));
        }
        if (direction[2]) {
          camera.setViewUp(majorAxis(viewUp, 0, 1));
        }
      
        orientationWidget.updateMarkerOrientation();
        widgetManager.enablePicking();
        this.renderWindow.render();
      });


      this.renderer.resetCamera();
      widgetManager.enablePicking();
      this.renderWindow.render();
      const interactor = this.fullScreenRenderer.getInteractor()
      document.querySelector('body')!.removeEventListener('keypress',interactor.handleKeyPress)
      document.querySelector('body')!.removeEventListener('keydown',interactor.handleKeyDown)
      document.querySelector('body')!.removeEventListener('keyup',interactor.handleKeyUp)      

    }, 500);
  }

  handlePlay = () => {
    if (this.playing) {
      clearInterval(this.playInterval)
      this.playing = false
    } else {
      this.playing = true
      let index = 0
      this.playInterval = setInterval(() => {
        if (index === this.state.fileList.length) {
          index = 0
        }
        const selectedFile = this.state.fileList[index]
        this.source = vtk(this.fileData[selectedFile])
        this.mapper.setInputData(this.source);
        this.renderWindow.render();
        index += 1
      }, 250)
    }
    
  }

  handleFileChange = (e : React.ChangeEvent<HTMLSelectElement>) => {
    const selectedFile = e.target.value
    
    this.source = vtk(this.fileData[selectedFile])
    this.mapper.setInputData(this.source);
    this.renderWindow.render();
  }

  loadFile = (fileList: Array<any>) => {
    const fileArray = Array.from(fileList)
    this.setState((state : StateInterface) => {
      return {...state,  fileList: fileArray.map(e => e.name) };
    });

    const file = fileList[0]
    
    fileArray.forEach((item) => {
      const reader = new FileReader();
      reader.onload = e => {
        parserFile(item.name as string, reader.result).then((data) => { 
          this.fileData[item.name as string] = data;
        })
      };
    reader.readAsArrayBuffer(item);
    })


    const reader = new FileReader();

    reader.onload = e => {

        this.createPipeline(file.name, reader.result);
  
    };
    reader.readAsArrayBuffer(file);
  };

  updateRepresentation = (event:any) =>{
    const [
      visibility,
      representation,
      edgeVisibility,
    ] = event.target.value.split(':').map(Number);
    this.actor.getProperty().set({ representation, edgeVisibility });
    this.actor.setVisibility(!!visibility);
    this.renderWindow.render();
}
  
  componentDidUpdate(prevProps: any) {}

  render() {
    return (
      <div style={{ height: "100%", width: "100%" }}>
        <div style={{ height: "95%", width: "100%", background : "linear-gradient(rgb(116, 120, 190), rgb(193, 195, 202))" }} ref={this.container} />
        <div style={{ height: "5%", width: "100%" }}>
          <input
            ref = {this.props.inputOpenFileRef}
            type="file"
            multiple
            //@ts-ignore
            onChange={e => this.loadFile(e.target.files)}
            style={{display: "none"}}
          ></input>
          <select  style={{width:"15%"}} onChange = {e => this.handleFileChange(e)}>
          {this.state.fileList.map((option: any) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}    
          </select >
          <select onChange = {e => this.updateColorBy(e)}  style={{width:"15%"}}>
            {this.state.colorOption.map((option: any) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <select onChange = {e => this.updateRepresentation(e)}  style={{width:"15%"}}>
            { [
              {label:'Surface',value:"1:2:0"},
              {label: 'Hidden',value: "0:-1:0"},
              {label:'Points',value:"1:0:0"},
              {label:'Wireframe',value:"1:1:0"},
              {label:'Surface with Edge',value:"1:2:1"}
            ].map((option, idx) => (
              <option key={option.label} value={option.value}>
                {option.label}
              </option>
            ))
              
          }
          </select>
          <button onClick = {this.handlePlay}>Play</button>
        </div>
      </div>
    );
  }
}