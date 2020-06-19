import * as ReactGA from '../../src';

jest.mock('../../src/utils/loadGA');

describe('timing()', () => {
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

  it('should warn if args object is missing', () => {
    ReactGA.initialize('foo');
    ReactGA.timing();
    expect(spies.warn).toHaveBeenCalledWith(
      '[react-ga]',
      'args.category, args.variable AND args.value are required in timing() ' +
        'AND args.value has to be a number'
    );
  });

  it('should warn if category arg is missing', () => {
    ReactGA.initialize('foo');
    ReactGA.timing({ variable: 'Timing test', value: 1000 });
    expect(spies.warn).toHaveBeenCalledWith(
      '[react-ga]',
      'args.category, args.variable AND args.value are required in timing() ' +
        'AND args.value has to be a number'
    );
  });

  it('should warn if category arg is empty string value', () => {
    ReactGA.initialize('foo');
    ReactGA.timing({ category: '', variable: 'Timing test', value: 1000 });
    expect(spies.warn).toHaveBeenCalledWith(
      '[react-ga]',
      'args.category, args.variable AND args.value are required in timing() ' +
        'AND args.value has to be a number'
    );
  });

  it('should warn if variable arg is missing', () => {
    ReactGA.initialize('foo');
    ReactGA.timing({ category: 'Test', value: 1000 });
    expect(spies.warn).toHaveBeenCalledWith(
      '[react-ga]',
      'args.category, args.variable AND args.value are required in timing() ' +
        'AND args.value has to be a number'
    );
  });

  it('should warn if variable arg is empty string value', () => {
    ReactGA.initialize('foo');
    ReactGA.timing({ category: 'Test', value: 1000, variable: '' });
    expect(spies.warn).toHaveBeenCalledWith(
      '[react-ga]',
      'args.category, args.variable AND args.value are required in timing() ' +
        'AND args.value has to be a number'
    );
  });

  it('should warn if value arg is missing', () => {
    ReactGA.initialize('foo');
    ReactGA.timing({ category: 'Test', variable: 'Timing test' });
    expect(spies.warn).toHaveBeenCalledWith(
      '[react-ga]',
      'args.category, args.variable AND args.value are required in timing() ' +
        'AND args.value has to be a number'
    );
  });

  it('should not warn if value arg is 0, a falsy number', () => {
    ReactGA.initialize('foo');
    ReactGA.timing({
      category: 'Test',
      variable: 'Timing test',
      value: 0
    });
    expect(spies.warn).not.toHaveBeenCalledWith(
      '[react-ga]',
      'args.category, args.variable AND args.value are required in timing() ' +
        'AND args.value has to be a number'
    );
  });

  it('should warn if value arg is not a number', () => {
    ReactGA.initialize('foo');
    ReactGA.timing({
      category: 'Test',
      variable: 'Timing test',
      value: 'Not a number'
    });
    expect(spies.warn).toHaveBeenCalledWith(
      '[react-ga]',
      'args.category, args.variable AND args.value are required in timing() ' +
        'AND args.value has to be a number'
    );
  });

  it('should create timing event without timingLabel', () => {
    ReactGA.initialize('foo');
    ReactGA.timing({
      category: 'Test',
      variable: 'Timing test',
      value: 1000
    });
    expect(spies.ga).toHaveBeenCalledTimes(2);
    expect(spies.ga).toHaveBeenNthCalledWith(1, 'create', 'foo', 'auto');
    expect(spies.ga).toHaveBeenNthCalledWith(2, 'send', {
      timingVar: 'Timing Test',
      timingCategory: 'Test',
      timingValue: 1000,
      hitType: 'timing'
    });
  });

  it('should create timing event with timingLabel', () => {
    ReactGA.initialize('foo');
    ReactGA.timing({
      category: 'Test',
      variable: 'Timing test',
      value: 1000,
      label: 'Timing test label'
    });
    expect(spies.ga).toHaveBeenCalledTimes(2);
    expect(spies.ga).toHaveBeenNthCalledWith(1, 'create', 'foo', 'auto');
    expect(spies.ga).toHaveBeenNthCalledWith(2, 'send', {
      timingVar: 'Timing Test',
      timingCategory: 'Test',
      timingValue: 1000,
      timingLabel: 'Timing Test Label',
      hitType: 'timing'
    });
  });
});
