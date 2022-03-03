import { PageConfig } from '@jupyterlab/coreutils';
let basePath = PageConfig.getOption('baseUrl');
if (!basePath) {
  basePath = '/';
}
const _public_path__ = basePath + 'lab/extensions/jupyterview/static/';
const itkConfig = {
  itkModulesPath: _public_path__ + 'itk'
};

export default itkConfig;
