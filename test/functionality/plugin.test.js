import * as ReactGA from '../../src';

jest.mock('../../src/utils/loadGA');

describe('Plugin', () => {
  const spies = {};

  beforeEach(() => {
    spies.warn = jest
      .spyOn(global.console, 'warn')
      .mockImplementation(() => {});
    spies.info = jest
      .spyOn(global.console, 'info')
      .mockImplementation(() => {});
    spies.ga = jest.fn();
    global.window.ga = spies.ga;
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should require the plugin: ecommerce', () => {
    ReactGA.initialize('plugin');
    ReactGA.plugin.require('ecommerce');

    expect(spies.ga).toHaveBeenCalledTimes(2);
    expect(spies.ga).toHaveBeenNthCalledWith(1, 'create', 'plugin', 'auto');
    expect(spies.ga).toHaveBeenNthCalledWith(2, 'require', 'ecommerce');
  });

  it('should execute ecommerce:addItem', () => {
    ReactGA.initialize('plugin');
    ReactGA.plugin.execute('ecommerce', 'addItem', {
      id: 1,
      name: 'Product'
    });

    expect(spies.ga).toHaveBeenCalledTimes(2);
    expect(spies.ga).toHaveBeenNthCalledWith(1, 'create', 'plugin', 'auto');
    expect(spies.ga).toHaveBeenNthCalledWith(2, 'ecommerce:addItem', {
      id: 1,
      name: 'Product'
    });
  });

  it("should execute ec:setAction 'checkout' with payload { 'step': 1 }", () => {
    ReactGA.initialize('plugin');
    ReactGA.plugin.execute('ec', 'setAction', 'checkout', { step: 1 });
    expect(spies.ga).toHaveBeenCalledTimes(2);
    expect(spies.ga).toHaveBeenNthCalledWith(1, 'create', 'plugin', 'auto');
    expect(spies.ga).toHaveBeenNthCalledWith(2, 'ec:setAction', 'checkout', {
      step: 1
    });
  });

  it('should execute ecommerce:send', () => {
    ReactGA.initialize('plugin');
    ReactGA.plugin.execute('ecommerce', 'send');
    expect(spies.ga).toHaveBeenCalledTimes(2);
    expect(spies.ga).toHaveBeenNthCalledWith(1, 'create', 'plugin', 'auto');
    expect(spies.ga).toHaveBeenNthCalledWith(2, 'ecommerce:send');
  });
});
