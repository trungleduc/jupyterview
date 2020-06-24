// Copyright (c) Trung Le
// Distributed under the terms of the Modified BSD License.

import React from "react";
import { SendMsgInterface, VtkModel } from "../widget";
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
import vtk from "vtk.js/Sources/vtk";
import {
  ColorMode,
  ScalarMode,
  //@ts-ignore
} from "vtk.js/Sources/Rendering/Core/Mapper/Constants";
//@ts-ignore
import vtkColorMaps from "vtk.js/Sources/Rendering/Core/ColorTransferFunction/ColorMaps";
//@ts-ignore
import vtkOrientationMarkerWidget from "vtk.js/Sources/Interaction/Widgets/OrientationMarkerWidget";
//@ts-ignore
import vtkAxesActor from "vtk.js/Sources/Rendering/Core/AxesActor";
//@ts-ignore
import vtkInteractiveOrientationWidget from "vtk.js/Sources/Widgets/Widgets3D/InteractiveOrientationWidget";
//@ts-ignore
import vtkWidgetManager from "vtk.js/Sources/Widgets/Core/WidgetManager";
//@ts-ignore
import * as vtkMath from "vtk.js/Sources/Common/Core/Math";

import { majorAxis, getFileExt, parserFile, processFile } from "../tools/utils";
import * as ReduxAction from "../redux/actions";
import { ReduxStateInterface, Dict } from "../redux/types";
import { connect } from "react-redux";

interface StateInterface {
  colorOption: Array<{}>;
  fileList: Array<string>;
  dataRangeOption: { [key: string]: any };
  selectedFile: string;
}
interface PropsInterface {
  inputOpenFileRef: React.RefObject<any>;
  send_msg: SendMsgInterface;
  model: VtkModel;
  updateProgress: (open: boolean, value: number) => void;
  updatePipeline: (data: Dict) => (f: any) => void;
  pipelineList : Array<Dict>
}

const getPipelines = (state: ReduxStateInterface) => {
  let pipelineList = state.pipelines
  return {
    pipelineList
  };
};

const mapStateToProps = (state: ReduxStateInterface) => {
  return getPipelines(state);
};

const mapDispatchToProps = (dispatch: (f: any) => void) => {
  return {
    updatePipeline: (data: Array<Dict>) =>
      dispatch(ReduxAction.updatePipeline(data)),
  };
};

export class VtkWidget extends React.Component<PropsInterface, StateInterface> {
  private fullScreenRenderer: any;
  private renderer: any;
  private source: any;
  private renderWindow: any;
  private mapper: any;
  private container: any;
  private dataRange: any;
  private activeArray: any;
  private lookupTable: any;
  private actor: any;
  private SUPPORTED_FILE: any;
  private allSource: {};
  private fileData: any;
  private playing: boolean;
  private playInterval: any;
  private remoteFileList: Array<string>;
  private progress: number;
  constructor(props: any) {
    super(props);
    this.fullScreenRenderer = null;
    this.renderer = null;
    this.source = null;
    this.renderWindow = null;
    this.mapper = null;
    this.container = React.createRef();
    this.state = {
      colorOption: [],
      fileList: [],
      dataRangeOption: {},
      selectedFile: "",
    };
    this.dataRange = null;
    this.activeArray = null;
    this.lookupTable = null;
    this.actor = null;
    this.SUPPORTED_FILE = ["vtp", "vtu"];
    this.allSource = {};
    this.fileData = {};
    this.playing = false;
    this.playInterval = null;
    this.remoteFileList = [];
    this.progress = 0;
    this.loadFile.bind(this);
    this.props.model.listenTo(this.props.model, "msg:custom", this.handleMsg);
    this.props.model.listenTo(
      this.props.model,
      "change:request_file_list",
      this.loadRemoteFile
    );
  }

  private loadRemoteFile = (model, value: Array<Object>) => {
    if (value.length > 0) {
      this.remoteFileList = Object.keys(value);
      this.progress = value.length;
      value.forEach((value, index) => {
        this.props.send_msg({ action: "open_file", payload: { index } });
      });
    }
  };

  private handleMsg = (content, data) => {
    const type = content["type"];
    if (type === "vtkData") {
      const { file_name, pvd, progress, next_index } = content["response"];

      parserFile(file_name, data[0].buffer).then((parsedData) => {
        --this.progress;
        const progressVal =
          100 * (1 - this.progress / this.remoteFileList.length);

        this.fileData[file_name] = parsedData;

        if (this.progress === 0) {
          const fileList = Object.keys(this.fileData).sort();
          this.createPipeline(this.fileData[fileList[0]]);
          this.setState((state: StateInterface) => {
            return { ...state, fileList };
          });
          this.props.updateProgress(false, 0);
        }
        this.props.updateProgress(true, progressVal);
      });
    }
  };

  createPipeline = (polyData: any) => {
    this.lookupTable = vtkColorTransferFunction.newInstance();
    this.mapper = vtkMapper.newInstance({
      interpolateScalarsBeforeMapping: false,
      useLookupTableScalarRange: true,
      lookupTable: this.lookupTable,
      scalarVisibility: false,
    });

    this.actor = vtkActor.newInstance();
    this.actor.setMapper(this.mapper);

    this.lookupTable.onModified(() => {
      this.renderWindow.render();
    });

    this.source = vtk(polyData);

    const scalars = this.source.getPointData().getScalars();
    this.dataRange = [].concat(scalars ? scalars.getRange() : [0, 1]);
    this.activeArray = vtkDataArray;
    if (this.state.colorOption.length === 0) {
      const colorByOptions = this.createComponentSelector();
      this.setState((state: StateInterface) => {
        return { ...state, colorOption: colorByOptions };
      });
    }
    this.mapper.setInputData(this.source);
    this.renderer.addActor(this.actor);
    this.renderer.resetCamera();
    this.renderWindow.render();
  };

  createComponentSelector = () => {
    const pointDataArray = this.source.getPointData().getArrays();
    let option: Array<{}> = [{ value: ":", label: "Solid color" }];
    pointDataArray.forEach((a: any) => {
      let name = a.getName();
      let numberComp = a.getNumberOfComponents();
      option.push({
        label: `(p) ${name} magnitude`,
        value: `PointData:${name}:-1`,
      });
      for (let index = 0; index < numberComp; index++) {
        option.push({
          label: `(p) ${name} ${index}`,
          value: `PointData:${name}:${index}`,
        });
      }
    });
    const cellDataArray = this.source.getCellData().getArrays();

    cellDataArray.forEach((a: any) => {
      let name = a.getName();
      let numberComp = a.getNumberOfComponents();
      option.push({
        label: `(p) ${name} magnitude`,
        value: `CellData:${name}:-1`,
      });
      for (let index = 0; index < numberComp; index++) {
        option.push({
          label: `(p) ${name} ${index}`,
          value: `CellData:${name}:${index}`,
        });
      }
    });
    return option;
  };

  updateColorBy = (event: any) => {
    const [location, colorByArrayName, indexValue] = event.target.value.split(
      ":"
    );

    const selectedFile = this.state.selectedFile;
    const interpolateScalarsBeforeMapping = location === "PointData";
    let colorMode = ColorMode.DEFAULT;
    let scalarMode = ScalarMode.DEFAULT;
    const scalarVisibility = location.length > 0;
    if (scalarVisibility) {
      const newArray = this.source[`get${location}`]().getArrayByName(
        colorByArrayName
      );

      const selectedComp = parseInt(indexValue);
      this.activeArray = newArray;

      const newDataRange: Array<number> = this.activeArray.getRange(
        selectedComp
      );
      this.dataRange[0] = newDataRange[0];
      this.dataRange[1] = newDataRange[1];
      if (this.dataRange[0] === this.dataRange[1]) {
        this.dataRange[1] = this.dataRange[0] + 0.0000000001;
      }

      colorMode = ColorMode.MAP_SCALARS;
      scalarMode =
        location === "PointData"
          ? ScalarMode.USE_POINT_FIELD_DATA
          : ScalarMode.USE_CELL_FIELD_DATA;

      if (this.mapper.getLookupTable()) {
        const lut = this.mapper.getLookupTable();
        if (selectedComp === -1) {
          lut.setVectorModeToMagnitude();
        } else {
          lut.setVectorModeToComponent();
          lut.setVectorComponent(selectedComp);
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
  };

  applyPreset = () => {
    const preset = vtkColorMaps.getPresetByName("rainbow");
    this.lookupTable.applyColorMap(preset);

    this.lookupTable.setMappingRange(this.dataRange[0], this.dataRange[1]);
    this.lookupTable.updateRange();
  };

  componentDidMount() {
    setTimeout(() => {
      this.fullScreenRenderer = vtkFullScreenRenderWindow.newInstance({
        background: [0, 0, 0, 0],
        container: this.container.current,
        rootContainer: this.container.current,
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
      vw.onOrientationChange(({ up, direction, action, event }: any) => {
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
      const interactor = this.fullScreenRenderer.getInteractor();
      document
        .querySelector("body")!
        .removeEventListener("keypress", interactor.handleKeyPress);
      document
        .querySelector("body")!
        .removeEventListener("keydown", interactor.handleKeyDown);
      document
        .querySelector("body")!
        .removeEventListener("keyup", interactor.handleKeyUp);
    }, 500);
  }

  handlePlay = () => {
    if (this.playing) {
      clearInterval(this.playInterval);
      this.playing = false;
    } else {
      this.playing = true;
      let index = 0;
      this.playInterval = setInterval(() => {
        if (index === this.state.fileList.length) {
          index = 0;
        }
        const selectedFile = this.state.fileList[index];
        this.source = vtk(this.fileData[selectedFile]);
        this.mapper.setInputData(this.source);
        this.renderWindow.render();
        index += 1;
      }, 250);
    }
  };

  handleFileChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedFile = e.target.value;
    this.setState((oldState) => ({ ...oldState, selectedFile }));
    this.source = vtk(this.fileData[selectedFile]);
    this.mapper.setInputData(this.source);
    this.renderWindow.render();
  };

  loadFile(fileList: FileList) {
    const fileArray = Array.from(fileList);
    this.setState((state: StateInterface) => {
      return { ...state, fileList: fileArray.map((e) => e.name) };
    });
    this.props.updateProgress(true, 0);
    let firstName = fileArray[0].name;
    let counter = fileArray.length;
    for (let index = 0; index < fileArray.length; index++) {
      const element = fileArray[index];
      processFile(element).then((data) => {
        --counter;
        this.fileData[element.name] = data;
        if (counter === 0) {
          if (this.source) {
            const selectedFile = firstName;
            this.setState((oldState) => ({ ...oldState, selectedFile }));
            this.source = vtk(this.fileData[selectedFile]);
            this.mapper.setInputData(this.source);
            this.renderWindow.render();
          } else {
            this.createPipeline(this.fileData[firstName]);
            this.props.inputOpenFileRef.current.value = "";
          }
          this.props.updateProgress(false, 0);
          this.props.updatePipeline([
            {
              name: firstName.split(".")[0],
              children: fileArray.map((e) => ({
                name: e.name,
                activated: false,
              })),
            },
          ]);
        }
        this.props.updateProgress(
          true,
          100 - (100 * counter) / fileArray.length
        );
      });
    }
  }

  updateRepresentation = (event: any) => {
    const [
      visibility,
      representation,
      edgeVisibility,
    ] = event.target.value.split(":").map(Number);
    this.actor.getProperty().set({ representation, edgeVisibility });
    this.actor.setVisibility(!!visibility);
    this.renderWindow.render();
  };

  componentDidUpdate(prevProps: PropsInterface, prevState: StateInterface) {
    const pipelineList = this.props.pipelineList
    if (pipelineList !== prevProps.pipelineList) {
      console.log("updated pipeline");     
    }
  }

  render() {
    return (
      <div style={{ height: "100%", width: "100%" }}>
        <div
          style={{
            height: "95%",
            width: "100%",
            background:
              // "linear-gradient(rgb(116, 120, 190), rgb(193, 195, 202))",
              "linear-gradient(#000028, #ffffff)",
          }}
          ref={this.container}
        />

        <div
          style={{
            height: "5%",
            width: "100%",
            background: "aliceblue",
            padding: "10px",
          }}
        >
          <input
            ref={this.props.inputOpenFileRef}
            type="file"
            multiple
            //@ts-ignore
            onChange={(e) => this.loadFile(e.target.files)}
            style={{ display: "none" }}
          ></input>
          <select
            style={{ width: "15%" }}
            onChange={(e) => this.handleFileChange(e)}
            value={this.state.selectedFile}
          >
            {this.state.fileList.map((option: any) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <select
            onChange={(e) => this.updateColorBy(e)}
            style={{ width: "15%" }}
          >
            {this.state.colorOption.map((option: any) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <select
            onChange={(e) => this.updateRepresentation(e)}
            style={{ width: "15%" }}
          >
            {[
              { label: "Surface", value: "1:2:0" },
              { label: "Hidden", value: "0:-1:0" },
              { label: "Points", value: "1:0:0" },
              { label: "Wireframe", value: "1:1:0" },
              { label: "Surface with Edge", value: "1:2:1" },
            ].map((option, idx) => (
              <option key={option.label} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button onClick={this.handlePlay}>Play</button>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(VtkWidget);
