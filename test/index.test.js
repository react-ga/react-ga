// eslint-disable-next-line import/no-duplicates
import DefaultReactGA from '../src/index';
// eslint-disable-next-line import/no-duplicates
import * as ReactGA from '../src/index';

describe('react-ga', () => {
  it('should import as both default and * syntax', () => {
    expect(Object.keys(DefaultReactGA).sort()).toStrictEqual(
      Object.keys(ReactGA).sort()
    );
  });
});
