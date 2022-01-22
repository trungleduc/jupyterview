import * as React from 'react';
import { DocumentRegistry } from '@jupyterlab/docregistry';
import { v4 as uuid } from 'uuid';
import { JupyterViewModel } from './model';

import {
  IMainMessage,
  IWorkerMessage,
  WorkerAction,
  MainAction
} from './types';
import { majorAxis } from './tools';
// import vtk
import '@kitware/vtk.js/Rendering/OpenGL/Profiles/All';
import vtkRenderWindowWithControlBar from '@kitware/vtk.js/Rendering/Misc/RenderWindowWithControlBar';
import vtkRenderer from '@kitware/vtk.js/Rendering/Core/Renderer';
import vtkRenderWindow, {
  DEFAULT_VIEW_API
} from '@kitware/vtk.js/Rendering/Core/RenderWindow';
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
import vtkFullScreenRenderWindow from '@kitware/vtk.js/Rendering/Misc/FullScreenRenderWindow';
import vtkOpenGLRenderWindow from '@kitware/vtk.js/Rendering/OpenGL/RenderWindow';
import vtkRenderWindowInteractor from '@kitware/vtk.js/Rendering/Core/RenderWindowInteractor';
import vtkInteractorStyleTrackballCamera from '@kitware/vtk.js/Interaction/Style/InteractorStyleTrackballCamera';
import vtkConeSource from '@kitware/vtk.js/Filters/Sources/ConeSource';
import vtkCornerAnnotation from '@kitware/vtk.js/Interaction/UI/CornerAnnotation';
import vtkSlider from '@kitware/vtk.js/Interaction/UI/Slider';
import { readPolyDataArrayBuffer, ReadPolyDataResult } from 'itk-wasm/dist';
import vtkPolyData from '@kitware/vtk.js/Common/DataModel/PolyData';
type THEME_TYPE = 'JupyterLab Dark' | 'JupyterLab Light';
const DARK_THEME: THEME_TYPE = 'JupyterLab Dark';
const LIGHT_THEME: THEME_TYPE = 'JupyterLab Light';

const BG_COLOR = {
  [DARK_THEME]: 'linear-gradient(rgb(0, 0, 42), rgb(82, 87, 110))',
  [LIGHT_THEME]: 'linear-gradient(#000028, #ffffff)'
};

interface IProps {
  context: DocumentRegistry.IContext<JupyterViewModel>;
}

interface IStates {
  id: string;
  loading: boolean;
  theme: THEME_TYPE;
}

export class MainView extends React.Component<IProps, IStates> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      id: uuid(),
      theme: LIGHT_THEME,
      loading: true
    };
    this._context = props.context;
    this.container = React.createRef<HTMLDivElement>();
  }

  componentDidMount(): void {
    setTimeout(() => {
      const rootContainer = this.container.current!;
      rootContainer.style.position = 'relative';

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
      // orientationWidget.setViewportCorner(
      //   vtkOrientationMarkerWidget.Corners.BOTTOM_LEFT
      // );
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
        const fileContent = this._model!.toString();
        const str = `data:application/octet-stream;base64,${fileContent}`;
        fetch(str)
          .then(b => b.arrayBuffer())
          .then(buff => readPolyDataArrayBuffer(null, buff, 'temp.vtu', ''))
          .then(polyResult => this.createPipeline(polyResult))
          .catch(e => console.log(e));
      });
    }, 500);
  }

  createPipeline = (polyResult: ReadPolyDataResult): void => {
    polyResult.webWorker.terminate();
    console.log(polyResult.polyData);

    this._lookupTable = vtkColorTransferFunction.newInstance();
    this._mapper = vtkMapper.newInstance({
      interpolateScalarsBeforeMapping: false,
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
    console.log(this._source);

    const scalars = this._source.getPointData().getScalars();
    this._dataRange = scalars
      ? [scalars.getRange().min, scalars.getRange().max]
      : [0, 1];
    this._activeArray = vtkDataArray;

    this._mapper.setInputData(this._source);
    this._renderer.addActor(this._actor);
    this._renderer.resetCamera();
    this._renderWindow.render();
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
            background: BG_COLOR[LIGHT_THEME] //"radial-gradient(#efeded, #8f9091)"
          }}
        />
      </div>
    );
  }

  private container: React.RefObject<HTMLDivElement>; // Reference of render div
  private _context: DocumentRegistry.IContext<JupyterViewModel>;
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
  private _activeArray: typeof vtkDataArray;
  private _lookupTable: vtkColorTransferFunction;
  private _actor: vtkActor;
  // private _SUPPORTED_FILE: any = null;
  // private _allSource: {};
  // private _fileData: any = null;
}
