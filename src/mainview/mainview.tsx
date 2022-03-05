// import vtk
import '@kitware/vtk.js/Rendering/OpenGL/Profiles/All';

import { DocumentRegistry } from '@jupyterlab/docregistry';
import { ContentsManager } from '@jupyterlab/services';
import vtkDataArray from '@kitware/vtk.js/Common/Core/DataArray';
import * as vtkMath from '@kitware/vtk.js/Common/Core/Math';
import vtkMatrixBuilder from '@kitware/vtk.js/Common/Core/MatrixBuilder';
import vtkPolyData from '@kitware/vtk.js/Common/DataModel/PolyData';
import vtkWarpScalar from '@kitware/vtk.js/Filters/General/WarpScalar';
import vtkOrientationMarkerWidget from '@kitware/vtk.js/Interaction/Widgets/OrientationMarkerWidget';
import vtkActor from '@kitware/vtk.js/Rendering/Core/Actor';
import vtkAxesActor from '@kitware/vtk.js/Rendering/Core/AxesActor';
import { vtkCamera } from '@kitware/vtk.js/Rendering/Core/Camera';
import vtkColorTransferFunction from '@kitware/vtk.js/Rendering/Core/ColorTransferFunction';
import vtkColorMaps from '@kitware/vtk.js/Rendering/Core/ColorTransferFunction/ColorMaps';
import vtkMapper from '@kitware/vtk.js/Rendering/Core/Mapper';
import {
  ColorMode,
  ScalarMode
} from '@kitware/vtk.js/Rendering/Core/Mapper/Constants';
import vtkRenderer from '@kitware/vtk.js/Rendering/Core/Renderer';
import vtkRenderWindow from '@kitware/vtk.js/Rendering/Core/RenderWindow';
import vtkScalarBarActor from '@kitware/vtk.js/Rendering/Core/ScalarBarActor';
import vtkRenderWindowWithControlBar from '@kitware/vtk.js/Rendering/Misc/RenderWindowWithControlBar';
import { Vector3 } from '@kitware/vtk.js/types';
import vtk from '@kitware/vtk.js/vtk';
import vtkWidgetManager from '@kitware/vtk.js/Widgets/Core/WidgetManager';
import vtkInteractiveOrientationWidget from '@kitware/vtk.js/Widgets/Widgets3D/InteractiveOrientationWidget';
import readPolyDataArrayBuffer from 'itk/readPolyDataArrayBuffer';
import * as React from 'react';
import { v4 as uuid } from 'uuid';

import {
  b64_to_utf8,
  convertPath,
  debounce,
  majorAxis,
  moveCamera,
  VIEW_ORIENTATIONS
} from '../tools';
import { IControlViewSharedState, IMainViewSharedState } from '../types';
import { CameraToolbar } from './cameraToolbar';
import { JupyterViewDoc, JupyterViewModel } from './model';
import {
  BG_COLOR,
  JUPYTER_FONT,
  LIGHT_THEME,
  OBJECT_COLOR,
  ROTATION_STEP,
  THEME_TYPE
} from './utils';

interface IProps {
  context: DocumentRegistry.IContext<JupyterViewModel>;
}

interface IStates {
  id: string;
  loading: boolean;
  theme: THEME_TYPE;
  colorOption: { label: string; value: string }[];
  counter: number;
}

export class MainView extends React.Component<IProps, IStates> {
  constructor(props: IProps) {
    super(props);
    const theme = ((window as any).jupyterlabTheme ||
      LIGHT_THEME) as THEME_TYPE;
    this.state = {
      id: uuid(),
      theme,
      loading: true,
      colorOption: [],
      counter: 0
    };
    this._context = props.context;
    this._sharedModel = props.context.model.sharedModel;
    this.container = React.createRef<HTMLDivElement>();
    this._fileData = {};
  }

  componentDidMount(): void {
    setTimeout(() => {
      const rootContainer = this.container.current!;

      this._fullScreenRenderer = vtkRenderWindowWithControlBar.newInstance({
        controlSize: 0
      });
      this._fullScreenRenderer.setContainer(rootContainer);
      this._renderer = this._fullScreenRenderer.getRenderer();
      this._renderer.setBackground([0, 0, 0, 0]);
      this._renderWindow = this._fullScreenRenderer.getRenderWindow();
      const axes = vtkAxesActor.newInstance();
      const orientationWidget = vtkOrientationMarkerWidget.newInstance({
        actor: axes,
        interactor: this._renderWindow.getInteractor()
      });
      orientationWidget.setEnabled(true);
      orientationWidget.setViewportSize(0.15);
      orientationWidget.setMinPixelSize(100);
      orientationWidget.setMaxPixelSize(300);

      const camera = (this._camera = this._renderer.getActiveCamera());

      const widgetManager = vtkWidgetManager.newInstance();
      widgetManager.setRenderer(orientationWidget.getRenderer());
      const widget = vtkInteractiveOrientationWidget.newInstance();
      widget.placeWidget(axes.getBounds());
      widget.setBounds(axes.getBounds());
      widget.setPlaceFactor(1);
      const vw = widgetManager.addWidget(widget);
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
        let axis: number[] = [];
        if (direction[0]) {
          axis = majorAxis(viewUp, 1, 2);
        }
        if (direction[1]) {
          axis = majorAxis(viewUp, 0, 2);
        }
        if (direction[2]) {
          axis = majorAxis(viewUp, 0, 1);
        }
        camera.setViewUp(axis[0], axis[1], axis[2]);
        orientationWidget.updateMarkerOrientation();
        widgetManager.enablePicking();
        this._renderWindow.render();
        this._syncCamera();
      });

      this._renderer.resetCamera();
      widgetManager.enablePicking();
      this._renderWindow.render();
      const interactor = this._fullScreenRenderer.getInteractor();

      document
        .querySelector('body')!
        .removeEventListener('keypress', interactor.handleKeyPress);
      document
        .querySelector('body')!
        .removeEventListener('keydown', interactor.handleKeyDown);
      document
        .querySelector('body')!
        .removeEventListener('keyup', interactor.handleKeyUp);

      this._context.ready.then(() => {
        this._model = this._context.model as JupyterViewModel;
        this._model.themeChanged.connect((_, arg) => {
          this.handleThemeChange(arg.newValue as THEME_TYPE);
        });

        this._sharedModel.controlViewStateChanged.connect(
          this.controlStateChanged
        );
        this._sharedModel.mainViewStateChanged.connect(
          this.mainViewStateChanged
        );

        const fullPath = convertPath(this._context.path);
        const dirPath = fullPath.substring(0, fullPath.lastIndexOf('/') + 1);
        const fileName = fullPath.replace(/^.*(\\|\/|:)/, '');

        const fileContent = this._sharedModel.getContent('content');
        const contentPromises = this.prepareFileContent(
          dirPath,
          fileName,
          fileContent
        );
        let counter = 0;
        const entries = Object.entries(contentPromises);
        const totalItems = entries.length;
        const firstName = entries[0][0];
        const fileList = Object.keys(contentPromises);
        for (const [path, promise] of entries) {
          const name = path.split('::')[0];
          promise.then(vtkStringContent => {
            this.stringToPolyData(vtkStringContent, name)
              .then(polyResult => {
                counter = Math.round(counter + 100 / totalItems);
                this._fileData[path] = vtk(polyResult.polyData);
                polyResult.webWorker.terminate();
                if (counter >= 99) {
                  this.createPipeline(this._fileData[firstName]);
                  this.setState(old => ({ ...old, loading: false, counter }));
                  this._sharedModel.setMainViewState({ fileList });
                } else {
                  this.setState(old => ({ ...old, counter }));
                }
              })
              .catch(e => {
                throw e;
              });
          });
        }

        const renderContainer =
          this._fullScreenRenderer.getRenderWindowContainer();
        renderContainer.addEventListener('mousedown', event => {
          this._mouseDown = true;
        });
        renderContainer.addEventListener('mouseup', event => {
          this._mouseDown = false;
        });

        renderContainer.addEventListener('mousemove', (event: MouseEvent) => {
          if (this._mouseDown) {
            this._syncCamera();
          }
        });
        renderContainer.addEventListener('wheel', (event: WheelEvent) => {
          this._syncCamera();
        });
      });
    }, 500);
  }

  handleThemeChange = (newTheme: THEME_TYPE): void => {
    this.setState(
      old => ({ ...old, theme: newTheme }),
      () => {
        const style =
          this.state.theme === LIGHT_THEME
            ? { fontColor: 'rgba(0, 0, 0, 0.87)' }
            : { fontColor: 'rgba(255, 255, 255, 0.87)' };
        this._scalarBarActor.setTickTextStyle(style);
        this._scalarBarActor.setAxisTextStyle(style);
        this._actor.getProperty().setColor(...OBJECT_COLOR[this.state.theme]);
      }
    );
  };

  private mainViewStateChanged = (
    _: any,
    changed: IMainViewSharedState
  ): void => {
    if (changed.camera) {
      if (!this._mouseDown) {
        const camera = changed.camera;
        this._camera.set(camera);
        this._renderer.resetCameraClippingRange();
        this._renderWindow.render();
      }
    }
  };

  prepareFileContent(
    filePath: string,
    fileName: string,
    fileContent
  ): { [key: string]: Promise<string> } {
    const pathList = fileName.split('.');
    const ext = pathList[pathList.length - 1];
    const promises: { [key: string]: Promise<string> } = {};
    if (ext.toLowerCase() === 'pvd') {
      const xmlStr = b64_to_utf8(fileContent);
      const parser = new DOMParser();
      const doc = parser.parseFromString(xmlStr, 'application/xml');
      const contents = new ContentsManager();
      doc.querySelectorAll('DataSet').forEach(item => {
        const timeStep = item.getAttribute('timestep');
        const vtuPath = item.getAttribute('file');
        const content = contents
          .get(`${filePath}/${vtuPath}`, {
            format: 'base64',
            content: true,
            type: 'file'
          })
          .then(iModel => iModel.content);
        promises[`${vtuPath}::${filePath}::${timeStep}`] = content;
      });
      return promises;
    }
    return { [`${fileName}::${filePath}::0`]: Promise.resolve(fileContent) };
  }
  async stringToPolyData(fileContent: string, filePath: string): Promise<any> {
    const str = `data:application/octet-stream;base64,${fileContent}`;
    return fetch(str)
      .then(b => b.arrayBuffer())
      .then(buff => readPolyDataArrayBuffer(null, buff, filePath, ''))
      .then(polyResult => {
        polyResult.webWorker.terminate();
        return polyResult;
      });
  }

  private controlStateChanged = (_, changed: IControlViewSharedState): void => {
    let needRerender = false;
    if (changed.selectedColor) {
      this.updateColorBy(changed.selectedColor!);
    }
    if (changed.colorSchema) {
      this.applyPreset({ colorSchema: changed.colorSchema! });
    }

    if (changed.modifiedDataRange) {
      this.applyPreset({
        colorSchema: this._sharedModel.getControlViewStateByKey('colorSchema'),
        dataRange: changed.modifiedDataRange
      });
    }

    if (changed.displayMode) {
      const [visibility, representation, edgeVisibility] = changed.displayMode
        .split(':')
        .map(Number);
      this._actor.getProperty().set({ representation, edgeVisibility });
      this._actor.setVisibility(!!visibility);
      needRerender = true;
    }

    if (changed.opacity) {
      this._actor.getProperty().setOpacity(changed.opacity);
      needRerender = true;
    }

    if (changed.warpFactor || changed.warpFactor === 0) {
      const value = Number(changed.warpFactor);
      this._warpScalar.setScaleFactor(value);
      this._mapper.setInputData(this._warpScalar.getOutputData());
      needRerender = true;
    }

    if (changed.selectedWarp) {
      const [location, colorByArrayName, indexValue] =
        changed.selectedWarp.split(':');
      if (location === '') {
        this._warpScalar.setScaleFactor(0);
      } else {
        this._warpScalar.setInputArrayToProcess(0, colorByArrayName, location);
      }
      this._mapper.setInputData(this._warpScalar.getOutputData());
      needRerender = true;
    }

    if (changed.warpNormalAxis) {
      this._warpScalar.setNormal(changed.warpNormalAxis);
      this._warpScalar.update();
      this._mapper.setInputData(this._warpScalar.getOutputData());
      needRerender = true;
    }

    if (changed.selectedDataset) {
      this._source = this._fileData[changed.selectedDataset];
      this._warpScalar.setInputData(this._source);
      this._mapper.setInputData(this._warpScalar.getOutputData());
      needRerender = true;
    }

    if (needRerender) {
      setTimeout(() => this._renderWindow.render(), 50);
    }
  };

  updateColorBy = (color: string): void => {
    const [location, colorByArrayName, indexValue] = color.split(':');
    const interpolateScalarsBeforeMapping = location === 'PointData';
    let colorMode = ColorMode.DEFAULT;
    let scalarMode = ScalarMode.DEFAULT;
    const scalarVisibility = location.length > 0;
    if (scalarVisibility) {
      const newArray =
        this._source[`get${location}`]().getArrayByName(colorByArrayName);

      const selectedComp = parseInt(indexValue);
      this._activeArray = newArray;

      const newDataRange = this._activeArray.getRange(selectedComp);
      this._dataRange[0] = newDataRange[0];
      this._dataRange[1] = newDataRange[1];
      if (this._dataRange[0] === this._dataRange[1]) {
        this._dataRange[1] = this._dataRange[0] + 0.0000000001;
      }
      this._sharedModel.transact(() => {
        this._sharedModel.setMainViewState({ dataRange: [...this._dataRange] });
      });
      colorMode = ColorMode.MAP_SCALARS;
      scalarMode =
        location === 'PointData'
          ? ScalarMode.USE_POINT_FIELD_DATA
          : ScalarMode.USE_CELL_FIELD_DATA;

      if (this._mapper.getLookupTable()) {
        const lut = this._mapper.getLookupTable();
        if (selectedComp === -1) {
          lut.setVectorModeToMagnitude();
        } else {
          lut.setVectorModeToComponent();
          lut.setVectorComponent(selectedComp);
        }
      }
    }
    this._scalarBarActor.setAxisLabel(colorByArrayName);
    this._scalarBarActor.setVisibility(true);
    this._mapper.set({
      colorByArrayName,
      colorMode,
      interpolateScalarsBeforeMapping,
      scalarMode,
      scalarVisibility
    });
    this.applyPreset({
      colorSchema: this._sharedModel.getControlViewStateByKey('colorSchema')
    });
  };

  applyPreset = (options: {
    colorSchema?: string;
    dataRange?: number[];
  }): void => {
    if (!options.colorSchema) {
      options.colorSchema = 'erdc_rainbow_bright';
    }
    if (!options.dataRange) {
      options.dataRange = this._dataRange;
    }
    const preset = vtkColorMaps.getPresetByName(options.colorSchema);
    this._lookupTable.applyColorMap(preset);
    this._lookupTable.setMappingRange(
      options.dataRange[0],
      options.dataRange[1]
    );
    this._lookupTable.updateRange();

    setTimeout(() => this._renderWindow.render(), 250);
  };

  createComponentSelector = (): { label: string; value: string }[] => {
    const pointDataArray = this._source.getPointData().getArrays();
    const option: { label: string; value: string }[] = [
      { value: ':', label: 'Solid color' }
    ];
    pointDataArray.forEach((a: any) => {
      const name = a.getName();
      const numberComp = a.getNumberOfComponents();
      option.push({
        label: `${name}`,
        value: `PointData:${name}:-1`
      });
      if (numberComp > 1) {
        for (let index = 0; index < numberComp; index++) {
          option.push({
            label: `${name} - ${index}`,
            value: `PointData:${name}:${index}`
          });
        }
      }
    });
    const cellDataArray = this._source.getCellData().getArrays();

    cellDataArray.forEach((a: any) => {
      const name = a.getName();
      const numberComp = a.getNumberOfComponents();
      option.push({
        label: `${name}`,
        value: `CellData:${name}:-1`
      });
      for (let index = 0; index < numberComp; index++) {
        option.push({
          label: `${name} ${index}`,
          value: `CellData:${name}:${index}`
        });
      }
    });
    return option;
  };

  createPipeline = (polyResult: vtkPolyData): void => {
    this._lookupTable = vtkColorTransferFunction.newInstance();
    this._mapper = vtkMapper.newInstance({
      interpolateScalarsBeforeMapping: true,
      useLookupTableScalarRange: true,
      scalarVisibility: false
    });
    this._mapper.setLookupTable(this._lookupTable);
    this._actor = vtkActor.newInstance();
    this._actor.setMapper(this._mapper);
    this._actor.getProperty().setColor(...OBJECT_COLOR[this.state.theme]);
    this._lookupTable.onModified(() => {
      this._renderWindow.render();
    });

    this._source = polyResult;

    this._warpScalar = vtkWarpScalar.newInstance({
      scaleFactor: 0,
      useNormal: true
    });

    this._warpScalar.setNormal([0, 0, 1]);
    this._warpScalar.setInputData(this._source);
    const scalars = this._source.getPointData().getScalars();
    this._dataRange = scalars
      ? [scalars.getRange().min, scalars.getRange().max]
      : [0, 1];
    if (!this._sharedModel.getContent('mainViewState')) {
      const colorByOptions = this.createComponentSelector();
      this._sharedModel.setMainViewState({
        colorByOptions,
        dataRange: [...this._dataRange]
      });
    }
    const fontColor =
      this.state.theme === LIGHT_THEME
        ? 'rgba(0, 0, 0, 0.87)'
        : 'rgba(255, 255, 255, 0.87)';
    this._scalarBarActor = vtkScalarBarActor.newInstance();
    this._scalarBarActor.setAxisTextStyle({
      fontColor,
      fontFamily: JUPYTER_FONT,
      fontSize: '18px'
    });
    this._scalarBarActor.setTickTextStyle({
      fontColor,
      fontFamily: JUPYTER_FONT,
      fontSize: '12px'
    });
    this._scalarBarActor.setScalarsToColors(this._mapper.getLookupTable());
    this._scalarBarActor.setVisibility(false);
    this._scalarBarActor.setDrawNanAnnotation(false);
    this._mapper.setInputData(this._warpScalar.getOutputData());
    // this._mapper.setInputData(this._source);
    this._renderer.addActor(this._scalarBarActor);
    this._renderer.addActor(this._actor);
    this._renderer.resetCamera();
    const currentState = this._sharedModel.getControlViewState();
    if (Object.keys(currentState).length > 0) {
      this.controlStateChanged(null, currentState);
    } else {
      this._renderWindow.render();
    }
  };

  rotate = (angle: number): void => {
    const camera = this._renderer.getActiveCamera();
    const focalPoint = camera.getFocalPoint();
    const position = camera.getPosition();
    const viewUp = camera.getViewUp();
    const axis = [
      focalPoint[0] - position[0],
      focalPoint[1] - position[1],
      focalPoint[2] - position[2]
    ];
    vtkMatrixBuilder
      .buildFromDegree()
      .rotate(Number.isNaN(angle) ? 90 : angle, axis as any)
      .apply(viewUp);
    camera.setViewUp(...viewUp);
    camera.modified();
    // model.orientationWidget.updateMarkerOrientation();
    this._renderWindow.render();
  };

  rotateWithAnimation = (direction: 'left' | 'right'): (() => void) => {
    const sign = direction === 'left' ? 1 : -1;
    return (): void => {
      const interactor = this._renderWindow.getInteractor();
      interactor.requestAnimation(this._renderWindow);
      let count = 0;
      let intervalId: NodeJS.Timer;
      const rotate = () => {
        if (count < 90) {
          count += ROTATION_STEP;
          this.rotate(sign * ROTATION_STEP);
        } else {
          clearInterval(intervalId);
          interactor.cancelAnimation(this._renderWindow);
          this._syncCamera();
        }
      };
      intervalId = setInterval(rotate, 8);
    };
  };

  updateOrientation = (mode: 'x' | 'y' | 'z'): void => {
    if (!this._inAnimation) {
      this._inAnimation = true;
      const { axis, orientation, viewUp } = VIEW_ORIENTATIONS[mode];
      // const axisIndex  = VIEW_ORIENTATIONS[mode].axis
      const animateSteps = 100;

      const interactor = this._renderWindow.getInteractor();
      const camera = this._renderer.getActiveCamera();
      const originalPosition = camera.getPosition();
      const originalViewUp = camera.getViewUp();
      const originalFocalPoint = camera.getFocalPoint();
      const model = { axis, orientation, viewUp: viewUp as Vector3 };
      const position = camera.getFocalPoint();
      position[model.axis] += model.orientation;
      camera.setPosition(...position);
      camera.setViewUp(...model.viewUp);
      this._renderer.resetCamera();

      const destFocalPoint = camera.getFocalPoint();
      const destPosition = camera.getPosition();
      const destViewUp = camera.getViewUp();

      // Reset to original to prevent initial render flash
      camera.setFocalPoint(...originalFocalPoint);
      camera.setPosition(...originalPosition);
      camera.setViewUp(...originalViewUp);
      moveCamera(
        camera,
        this._renderer,
        interactor,
        destFocalPoint,
        destPosition,
        destViewUp,
        animateSteps
      ).then(() => {
        this._inAnimation = false;
        this._syncCamera();
      });
    }
  };

  resetCamera = (): void => {
    this._renderer.resetCamera();
    this._renderer.resetCameraClippingRange();
    setTimeout(this._renderWindow.render, 0);
    this._syncCamera();
  };

  render(): JSX.Element {
    return (
      <div
        style={{
          width: '100%',
          height: 'calc(100%)'
        }}
      >
        <div
          className={'jpview-Spinner'}
          style={{ display: this.state.loading ? 'flex' : 'none' }}
        >
          <div className={'jpview-SpinnerContent'}></div>
          <p
            style={{
              position: 'relative',
              right: '50%',
              fontSize: 'var(--jp-ui-font-size2)',
              color: '#27b9f3'
            }}
          >{`${this.state.counter}%`}</p>
        </div>
        <div
          ref={this.container}
          style={{
            width: '100%',
            height: 'calc(100%)',
            background: BG_COLOR[this.state.theme] //'radial-gradient(#efeded, #8f9091)'
          }}
        />
        <CameraToolbar
          rotateHandler={this.rotateWithAnimation}
          resetCamera={this.resetCamera}
          updateOrientation={this.updateOrientation}
        />
      </div>
    );
  }

  private container: React.RefObject<HTMLDivElement>; // Reference of render div
  private _context: DocumentRegistry.IContext<JupyterViewModel>;
  private _sharedModel: JupyterViewDoc;
  private _model: JupyterViewModel | undefined;

  private _fullScreenRenderer: vtkRenderWindowWithControlBar;
  private _renderer: vtkRenderer;
  private _source: vtkPolyData;
  private _renderWindow: vtkRenderWindow;
  private _mapper: vtkMapper;
  private _container: any = null;
  private _dataRange: number[];
  private _activeArray: vtkDataArray;
  private _lookupTable: vtkColorTransferFunction;
  private _actor: vtkActor;
  private _scalarBarActor: vtkScalarBarActor;
  private _inAnimation = false;
  private _warpScalar: vtkWarpScalar;
  private _fileData: { [key: string]: any };
  private _mouseDown = false;
  private _camera: vtkCamera;
  private _syncCamera = debounce(() => {
    const position = this._camera.getPosition();
    const focalPoint = this._camera.getFocalPoint();
    const viewUp = this._camera.getViewUp();
    this._sharedModel.setMainViewState({
      camera: { position, focalPoint, viewUp }
    });
  }, 100);
}
