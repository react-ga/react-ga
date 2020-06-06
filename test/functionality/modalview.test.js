import * as ReactGA from '../../src';

jest.mock('../../src/utils/loadGA');

describe('modalview()', () => {
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
  it('should output debug info, if debug is on', () => {
    const options = { debug: true };
    ReactGA.initialize('foo', options);
    ReactGA.modalview('valid');
    expect(spies.info).toHaveBeenCalledTimes(2);
    expect(spies.info).toHaveBeenNthCalledWith(
      1,
      '[react-ga]',
      "called ga('send', 'pageview', path);"
    );
    expect(spies.info).toHaveBeenNthCalledWith(
      2,
      '[react-ga]',
      'with path: /modal/valid'
    );
  });

  it('should record a modalview', () => {
    ReactGA.initialize('foo');
    ReactGA.modalview('valid');
    expect(spies.ga).toHaveBeenCalledTimes(2);
    expect(spies.ga).toHaveBeenNthCalledWith(1, 'create', 'foo', 'auto');
    expect(spies.ga).toHaveBeenNthCalledWith(
      2,
      'send',
      'pageview',
      '/modal/valid'
    );
  });

  it('should remove a leading slash', () => {
    ReactGA.initialize('foo');
    ReactGA.modalview('/valid');
    expect(spies.ga).toHaveBeenCalledTimes(2);
    expect(spies.ga).toHaveBeenNthCalledWith(1, 'create', 'foo', 'auto');
    expect(spies.ga).toHaveBeenNthCalledWith(
      2,
      'send',
      'pageview',
      '/modal/valid'
    );
  });

  it('should abort, log warning if modalName is not provided', () => {
    ReactGA.initialize('foo');
    ReactGA.modalview();
    expect(spies.warn).toHaveBeenCalledTimes(1);
    expect(spies.warn).toHaveBeenCalledWith(
      '[react-ga]',
      'modalName is required in .modalview(modalName)'
    );
  });

  it('should abort, log warning if modalName is empty string', () => {
    ReactGA.initialize('foo');
    ReactGA.modalview('');
    expect(spies.warn).toHaveBeenCalledTimes(1);
    expect(spies.warn).toHaveBeenCalledWith(
      '[react-ga]',
      'modalName is required in .modalview(modalName)'
    );
  });

  it('should abort, log warning if modalName is empty string of spaces', () => {
    ReactGA.initialize('foo');
    ReactGA.modalview('  ');
    expect(spies.warn).toHaveBeenCalledTimes(1);
    expect(spies.warn).toHaveBeenCalledWith(
      '[react-ga]',
      'modalName cannot be an empty string or a single / in .modalview()'
    );
  });

  it('should abort, log warning if modalName is /', () => {
    ReactGA.initialize('foo');
    ReactGA.modalview('/');
    expect(spies.warn).toHaveBeenCalledTimes(1);
    expect(spies.warn).toHaveBeenCalledWith(
      '[react-ga]',
      'modalName cannot be an empty string or a single / in .modalview()'
    );
  });
});
