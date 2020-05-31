
describe("Test itkConfig", () => {
  const itkConfig = require('../itkConfigJupyter')
  it('should be createable', () => {      
      expect(itkConfig).toEqual({
        itkModulesPath: "/nbextensions/jupyterview/itk",
      })
    });

});
