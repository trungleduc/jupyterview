import * as React from 'react';
import { DocumentRegistry } from '@jupyterlab/docregistry';
import { v4 as uuid } from 'uuid';
import { JupyterViewDoc, JupyterViewModel } from './model';
import { CameraToolbar } from './cameraToolbar';
import {
  IMainMessage,
  IWorkerMessage,
  WorkerAction,
  MainAction,
  IControlViewSharedState
} from '../types';
import { majorAxis, moveCamera, VIEW_ORIENTATIONS } from '../tools';
// import vtk
import '@kitware/vtk.js/Rendering/OpenGL/Profiles/All';
import vtkRenderWindowWithControlBar from '@kitware/vtk.js/Rendering/Misc/RenderWindowWithControlBar';
import vtkRenderer from '@kitware/vtk.js/Rendering/Core/Renderer';
import vtkRenderWindow from '@kitware/vtk.js/Rendering/Core/RenderWindow';
import vtkAxesActor from '@kitware/vtk.js/Rendering/Core/AxesActor';
import vtkOrientationMarkerWidget from '@kitware/vtk.js/Interaction/Widgets/OrientationMarkerWidget';
import vtkWidgetManager from '@kitware/vtk.js/Widgets/Core/WidgetManager';
import vtkInteractiveOrientationWidget from '@kitware/vtk.js/Widgets/Widgets3D/InteractiveOrientationWidget';
import * as vtkMath from '@kitware/vtk.js/Common/Core/Math';
import vtkActor from '@kitware/vtk.js/Rendering/Core/Actor';
import vtkMapper from '@kitware/vtk.js/Rendering/Core/Mapper';
import vtkColorTransferFunction from '@kitware/vtk.js/Rendering/Core/ColorTransferFunction';
import vtk from '@kitware/vtk.js/vtk';
import vtkDataArray from '@kitware/vtk.js/Common/Core/DataArray';
import vtkScalarBarActor from '@kitware/vtk.js/Rendering/Core/ScalarBarActor';
import { readPolyDataArrayBuffer, ReadPolyDataResult } from 'itk-wasm/dist';
import vtkPolyData from '@kitware/vtk.js/Common/DataModel/PolyData';
import vtkMatrixBuilder from '@kitware/vtk.js/Common/Core/MatrixBuilder';
import { Vector3 } from '@kitware/vtk.js/types';
import {
  ColorMode,
  ScalarMode
} from '@kitware/vtk.js/Rendering/Core/Mapper/Constants';
import vtkColorMaps from '@kitware/vtk.js/Rendering/Core/ColorTransferFunction/ColorMaps';
import vtkWarpScalar from '@kitware/vtk.js/Filters/General/WarpScalar';

type THEME_TYPE = 'JupyterLab Dark' | 'JupyterLab Light';
const DARK_THEME: THEME_TYPE = 'JupyterLab Dark';
const LIGHT_THEME: THEME_TYPE = 'JupyterLab Light';

const BG_COLOR = {
  [DARK_THEME]: 'linear-gradient(rgb(0, 0, 42), rgb(82, 87, 110))',
  [LIGHT_THEME]: 'linear-gradient(#000028, #ffffff)'
};

const ROTATION_STEP = 2;

const JUPYTER_FONT =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'";
interface IProps {
  context: DocumentRegistry.IContext<JupyterViewModel>;
}

interface IStates {
  id: string;
  loading: boolean;
  theme: THEME_TYPE;
  colorOption: { label: string; value: string }[];
}

export class MainView extends React.Component<IProps, IStates> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      id: uuid(),
      theme: LIGHT_THEME,
      loading: true,
      colorOption: []
    };
    this._context = props.context;
    this._sharedModel = props.context.model.sharedModel;
    this.container = React.createRef<HTMLDivElement>();
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

      const camera = this._renderer.getActiveCamera();
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
        this._sharedModel.controlViewStateChanged.connect(
          this.controlStateChanged
        );
        const fileName = this._context.path.replace(/^.*(\\|\/|:)/, '');
        const fileContent = this._model!.toString();
        this.stringToPolyData(fileContent, fileName)
          .then(polyResult => this.createPipeline(polyResult))
          .catch(e => {
            throw e;
          });
      });
    }, 500);
  }

  async stringToPolyData(
    fileContent: string,
    filePath: string
  ): Promise<ReadPolyDataResult> {
    const str = `data:application/octet-stream;base64,${fileContent}`;
    return fetch(str)
      .then(b => b.arrayBuffer())
      .then(buff => readPolyDataArrayBuffer(null, buff, filePath, ''))
      .then(polyResult => {
        polyResult.webWorker.terminate();
        return polyResult;
      });
  }

  controlStateChanged = (_, changed: IControlViewSharedState): void => {
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
      this._warpScalar.setInputArrayToProcess(0, colorByArrayName, location);
      this._mapper.setInputData(this._warpScalar.getOutputData());
      needRerender = true;
    }

    if (changed.warpNormalAxis) {
      this._warpScalar.setNormal(changed.warpNormalAxis);
      this._warpScalar.update()
      this._mapper.setInputData(this._warpScalar.getOutputData());
      needRerender = true;
    }

    if (needRerender) {
      setTimeout(() => this._renderWindow.render(), 250);
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
        this._sharedModel.setMainViewState('dataRange', [...this._dataRange]);
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

  createPipeline = (polyResult: ReadPolyDataResult): void => {
    polyResult.webWorker.terminate();
    this._lookupTable = vtkColorTransferFunction.newInstance();
    this._mapper = vtkMapper.newInstance({
      interpolateScalarsBeforeMapping: true,
      useLookupTableScalarRange: true,
      scalarVisibility: false
    });
    this._mapper.setLookupTable(this._lookupTable);
    this._actor = vtkActor.newInstance();
    this._actor.setMapper(this._mapper);

    this._lookupTable.onModified(() => {
      this._renderWindow.render();
    });

    this._source = vtk(polyResult.polyData);

    this._warpScalar = vtkWarpScalar.newInstance({
      scaleFactor: 0,
      useNormal: true
    });

    this._warpScalar.setNormal([1, 0, 0]);
    this._warpScalar.addInputData(this._source);
    console.log(
      'this._warpScalar',
      this._warpScalar,
      this._warpScalar.getNormal(),
      this._warpScalar.getXyPlane()
    );
    const scalars = this._source.getPointData().getScalars();
    this._dataRange = scalars
      ? [scalars.getRange().min, scalars.getRange().max]
      : [0, 1];
    if (!this._sharedModel.getContent('mainViewState')) {
      const colorByOptions = this.createComponentSelector();
      this._sharedModel.transact(() => {
        this._sharedModel.setMainViewState('colorByOptions', colorByOptions);
        this._sharedModel.setMainViewState('dataRange', [...this._dataRange]);
      });
    }
    this._scalarBarActor = vtkScalarBarActor.newInstance();
    this._scalarBarActor.setAxisTextStyle({
      fontColor: 'black',
      fontFamily: JUPYTER_FONT,
      fontSize: '18px'
    });
    this._scalarBarActor.setTickTextStyle({
      fontColor: 'black',
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
    this._renderWindow.render();
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
        }
      };
      intervalId = setInterval(rotate, 8);
    };
  };

  updateOrientation = (mode: 'x' | 'y' | 'z') => {
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
      });
    }
  };

  resetCamera = (): void => {
    this._renderer.resetCamera();
    this._renderer.resetCameraClippingRange();
    setTimeout(this._renderWindow.render, 0);
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
          {' '}
          <div className={'jpview-SpinnerContent'}></div>{' '}
        </div>
        <div
          ref={this.container}
          style={{
            width: '100%',
            height: 'calc(100%)',
            background: BG_COLOR[LIGHT_THEME] //'radial-gradient(#efeded, #8f9091)'
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
  private _worker?: Worker = undefined;
  private _messageChannel?: MessageChannel;

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
  // private _SUPPORTED_FILE: any = null;
  // private _allSource: {};
  // private _fileData: any = null;
}
