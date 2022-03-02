export type THEME_TYPE = 'JupyterLab Dark' | 'JupyterLab Light';
export const DARK_THEME: THEME_TYPE = 'JupyterLab Dark';
export const LIGHT_THEME: THEME_TYPE = 'JupyterLab Light';
//linear-gradient(rgb(0, 0, 42), rgb(82, 87, 110))
const DARK_BG =
  'linear-gradient(var(--jp-layout-color2), var(--jp-layout-color4))';
const LIGHT_BG =
  'linear-gradient(var(--jp-layout-color4), var(--jp-layout-color2))';

export const BG_COLOR = {
  [DARK_THEME]: DARK_BG, //'linear-gradient(rgb(0, 0, 42), rgb(82, 87, 110))',
  [LIGHT_THEME]: LIGHT_BG //'linear-gradient(#000028, #ffffff)'
};

export const ROTATION_STEP = 2;

export const JUPYTER_FONT =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'";
