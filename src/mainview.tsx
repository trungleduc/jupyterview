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
import vtkFullScreenRenderWindow from '@kitware/vtk.js/Rendering/Misc/FullScreenRenderWindow';
import vtkOpenGLRenderWindow from '@kitware/vtk.js/Rendering/OpenGL/RenderWindow';
import vtkRenderWindowInteractor from '@kitware/vtk.js/Rendering/Core/RenderWindowInteractor';
import vtkInteractorStyleTrackballCamera from '@kitware/vtk.js/Interaction/Style/InteractorStyleTrackballCamera';
import vtkConeSource from '@kitware/vtk.js/Filters/Sources/ConeSource';
import vtkCornerAnnotation from '@kitware/vtk.js/Interaction/UI/CornerAnnotation';
import vtkSlider from '@kitware/vtk.js/Interaction/UI/Slider';

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

enum Corners {
  TOP_LEFT,
  TOP_RIGHT,
  BOTTOM_LEFT,
  BOTTOM_RIGHT
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
    this._context.ready.then(() => {
      this._model = this._context.model as JupyterViewModel;
      this._worker = this._model.getWorker();
      this._messageChannel = new MessageChannel();
      this._messageChannel.port1.onmessage = msgEvent => {
        this.messageHandler(msgEvent.data);
      };
      this.postMessage(
        { action: WorkerAction.REGISTER, payload: { id: this.state.id } },
        this._messageChannel.port2
      );
    });
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
    }, 500);
  }

  messageHandler = (msg: IMainMessage): void => {
    switch (msg.action) {
      case MainAction.INITIALIZED: {
        this.postMessage({
          action: WorkerAction.LOAD_FILE,
          payload: {
            fileName: this._context.path,
            content: this._model!.toString()
          }
        });
      }
    }
  };

  private postMessage = (
    msg: Omit<IWorkerMessage, 'id'>,
    port?: MessagePort
  ) => {
    if (this._worker) {
      const newMsg = { ...msg, id: this.state.id };
      if (port) {
        this._worker.postMessage(newMsg, [port]);
      } else {
        this._worker.postMessage(newMsg);
      }
    }
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
  // private _source: any = null;
  private _renderWindow: vtkRenderWindow;
  // private _mapper: any = null;
  // private _container: any = null;
  // private _dataRange: any = null;
  // private _activeArray: any = null;
  // private _lookupTable: any = null;
  // private _actor: any = null;
  // private _SUPPORTED_FILE: any = null;
  // private _allSource: {};
  // private _fileData: any = null;
}
