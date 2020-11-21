import * as ReactGA from '../../src';

jest.mock('../../src/utils/loadGA');

describe('set()', () => {
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
    ReactGA.initialize('foo', { debug: true });
    ReactGA.set({ userId: 123 });
    expect(spies.info).toHaveBeenCalledTimes(2);
    expect(spies.info).toHaveBeenNthCalledWith(
      1,
      '[react-ga]',
      "called ga('set', fieldsObject);"
    );
    expect(spies.info).toHaveBeenNthCalledWith(
      2,
      '[react-ga]',
      'with fieldsObject: {"userId":123}'
    );
  });

  it('should warn if fieldsObject object is missing', () => {
    ReactGA.initialize('foo');
    ReactGA.set();
    expect(spies.warn).toHaveBeenCalledWith(
      '[react-ga]',
      '`fieldsObject` is required in .set()'
    );
  });

  it('should warn if fieldsObject is not an Object', () => {
    ReactGA.initialize('foo');
    ReactGA.set(123);
    expect(spies.warn).toHaveBeenCalledWith(
      '[react-ga]',
      'Expected `fieldsObject` arg to be an Object'
    );
  });

  it('should warn if fieldsObject object is an empty object', () => {
    ReactGA.initialize('foo');
    ReactGA.set({});
    expect(spies.warn).toHaveBeenCalledWith(
      '[react-ga]',
      'empty `fieldsObject` given to .set()'
    );
  });

  it('should set the field values', () => {
    ReactGA.initialize('foo');
    ReactGA.set({ userId: 123 });
    expect(spies.ga).toHaveBeenCalledTimes(2);
    expect(spies.ga).toHaveBeenNthCalledWith(1, 'create', 'foo', 'auto');
    expect(spies.ga).toHaveBeenNthCalledWith(2, 'set', { userId: 123 });
  });
});
