import * as React from 'react';

import { LabIcon } from '@jupyterlab/ui-components';
import vtkCamera from '@kitware/vtk.js/Rendering/Core/Camera';
import vtkRenderer from '@kitware/vtk.js/Rendering/Core/Renderer';
import vtkRenderWindowInteractor from '@kitware/vtk.js/Rendering/Core/RenderWindowInteractor';
import { Vector3 } from '@kitware/vtk.js/types';

import jvControlLight from '../style/icons/jvc-light.svg';
import rotateRight from '../style/icons/rotate_right_white_24dp.svg';
import rotateLeft from '../style/icons/rotate_left_white_24dp.svg';
import focusView from '../style/icons/center_focus_weak_white_24dp.svg';

export const jvcLightIcon = new LabIcon({
  name: 'jupyterview:control-light',
  svgstr: jvControlLight
});
export const rotateRightIcon = new LabIcon({
  name: 'jupyterview:rotate-right',
  svgstr: rotateRight
});
export const rotateLeftIcon = new LabIcon({
  name: 'jupyterview:rotate-left',
  svgstr: rotateLeft
});
export const focusViewIcon = new LabIcon({
  name: 'jupyterview:focus-view',
  svgstr: focusView
});

export function majorAxis(
  vec3: Vector3,
  idxA: number,
  idxB: number
): Array<number> {
  const axis = [0, 0, 0];
  const idx = Math.abs(vec3[idxA]) > Math.abs(vec3[idxB]) ? idxA : idxB;
  const value = vec3[idx] > 0 ? 1 : -1;
  axis[idx] = value;
  return axis;
}

export function moveCamera(
  camera: vtkCamera,
  renderer: vtkRenderer,
  interactor: vtkRenderWindowInteractor,
  focalPoint: number[],
  position: number[],
  viewUp: number[],
  animateSteps = 0
): Promise<void> {
  const EPSILON = 0.000001;
  const originalFocalPoint = camera.getFocalPoint();
  const originalPosition = camera.getPosition();
  const originalViewUp = camera.getViewUp();

  const animationStack = [
    {
      focalPoint,
      position,
      viewUp
    }
  ];

  if (animateSteps) {
    const deltaFocalPoint = [
      (originalFocalPoint[0] - focalPoint[0]) / animateSteps,
      (originalFocalPoint[1] - focalPoint[1]) / animateSteps,
      (originalFocalPoint[2] - focalPoint[2]) / animateSteps
    ];
    const deltaPosition = [
      (originalPosition[0] - position[0]) / animateSteps,
      (originalPosition[1] - position[1]) / animateSteps,
      (originalPosition[2] - position[2]) / animateSteps
    ];
    const deltaViewUp = [
      (originalViewUp[0] - viewUp[0]) / animateSteps,
      (originalViewUp[1] - viewUp[1]) / animateSteps,
      (originalViewUp[2] - viewUp[2]) / animateSteps
    ];

    const needSteps =
      deltaFocalPoint[0] ||
      deltaFocalPoint[1] ||
      deltaFocalPoint[2] ||
      deltaPosition[0] ||
      deltaPosition[1] ||
      deltaPosition[2] ||
      deltaViewUp[0] ||
      deltaViewUp[1] ||
      deltaViewUp[2];

    const focalPointDeltaAxisCount: number = deltaFocalPoint
      .map(i => (Math.abs(i) < EPSILON ? 0 : 1))
      .reduce((a, b) => (a + b) as any, 0);
    const positionDeltaAxisCount = deltaPosition
      .map(i => (Math.abs(i) < EPSILON ? 0 : 1))
      .reduce((a, b) => (a + b) as any, 0);
    const viewUpDeltaAxisCount = deltaViewUp
      .map(i => (Math.abs(i) < EPSILON ? 0 : 1))
      .reduce((a, b) => (a + b) as any, 0);
    const rotation180Only =
      viewUpDeltaAxisCount === 1 &&
      positionDeltaAxisCount === 0 &&
      focalPointDeltaAxisCount === 0;

    if (needSteps) {
      if (rotation180Only) {
        const availableAxes = originalFocalPoint
          .map((fp, i) =>
            Math.abs(originalPosition[i] - fp) < EPSILON ? i : null
          )
          .filter(i => i !== null) as number[];
        const axisCorrectionIndex = availableAxes.find(
          v => Math.abs(deltaViewUp[v]) < EPSILON
        );
        for (let i = 0; i < animateSteps; i++) {
          const newViewUp = [
            viewUp[0] + (i + 1) * deltaViewUp[0],
            viewUp[1] + (i + 1) * deltaViewUp[1],
            viewUp[2] + (i + 1) * deltaViewUp[2]
          ];
          newViewUp[axisCorrectionIndex!] = Math.sin(
            (Math.PI * i) / (animateSteps - 1)
          );
          animationStack.push({
            focalPoint,
            position,
            viewUp: newViewUp
          });
        }
      } else {
        for (let i = 0; i < animateSteps; i++) {
          animationStack.push({
            focalPoint: [
              focalPoint[0] + (i + 1) * deltaFocalPoint[0],
              focalPoint[1] + (i + 1) * deltaFocalPoint[1],
              focalPoint[2] + (i + 1) * deltaFocalPoint[2]
            ],
            position: [
              position[0] + (i + 1) * deltaPosition[0],
              position[1] + (i + 1) * deltaPosition[1],
              position[2] + (i + 1) * deltaPosition[2]
            ],
            viewUp: [
              viewUp[0] + (i + 1) * deltaViewUp[0],
              viewUp[1] + (i + 1) * deltaViewUp[1],
              viewUp[2] + (i + 1) * deltaViewUp[2]
            ]
          });
        }
      }
    }
  }

  if (animationStack.length === 1) {
    // update camera directly
    camera.set(animationStack.pop());
    renderer.resetCameraClippingRange();
    if (interactor.getLightFollowCamera()) {
      renderer.updateLightsGeometryToFollowCamera();
    }
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const now = performance.now().toString();
    const animationRequester = `moveCamera.${now}`;
    interactor.requestAnimation(animationRequester);
    let intervalId: NodeJS.Timer;
    const consumeAnimationStack = () => {
      if (animationStack.length) {
        const {
          focalPoint: cameraFocalPoint,
          position: cameraPosition,
          viewUp: cameraViewUp
        } = animationStack.pop()!;
        camera.setFocalPoint(
          cameraFocalPoint[0],
          cameraFocalPoint[1],
          cameraFocalPoint[2]
        );
        camera.setPosition(
          cameraPosition[0],
          cameraPosition[1],
          cameraPosition[2]
        );
        camera.setViewUp(cameraViewUp[0], cameraViewUp[1], cameraViewUp[2]);
        renderer.resetCameraClippingRange();

        if (interactor.getLightFollowCamera()) {
          renderer.updateLightsGeometryToFollowCamera();
        }
      } else {
        clearInterval(intervalId);
        interactor.cancelAnimation(animationRequester);
        resolve();
      }
    };
    intervalId = setInterval(consumeAnimationStack, 1);
  });
}

export const VIEW_ORIENTATIONS: {
  [key: string]: {
    axis: number;
    orientation: number;
    viewUp: number[];
  };
} = {
  default: {
    axis: 1,
    orientation: -1,
    viewUp: [0, 0, 1]
  },
  x: {
    axis: 0,
    orientation: 1,
    viewUp: [0, 0, 1]
  },
  y: {
    axis: 1,
    orientation: 1,
    viewUp: [0, 0, 1]
  },
  z: {
    axis: 2,
    orientation: 1,
    viewUp: [0, 1, 0]
  }
};

export function selectorFactory(props: {
  defaultValue: any;
  options: { value: any; label: string }[];
  onChange: (e: any) => void;
  label?: string;
}): JSX.Element {
  return (
    <div
      className="lm-Widget p-Widget jp-Dialog-body"
      style={{ margin: '2px 2px 5px 2px' }}
    >
      <div className="jp-select-wrapper" style={{ height: '32px' }}>
        {props.label ? <label>{props.label}</label> : <div />}
        <select
          value={props.defaultValue}
          onChange={props.onChange}
          className="jp-mod-styled"
          style={{ marginTop: '2px' }}
        >
          {props.options.map(option => (
            <option value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

export const debounce = (
  func: CallableFunction,
  timeout = 100
): CallableFunction => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, timeout);
  };
};

export function convertPath(windowsPath: string): string {
  return windowsPath
    .replace(/^\\\\\?\\/, '')
    .replace(/\\/g, '/')
    .replace(/\/\/+/g, '/');
}
export function b64_to_utf8(str) {
  return decodeURIComponent(atob(str));
}
