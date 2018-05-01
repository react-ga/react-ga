import should from 'should';
import { spy } from 'sinon';
/* eslint-disable mocha/no-hooks-for-single-case */

// eslint-disable-next-line import/no-duplicates
import DefaultReactGA from '../src/index';
// eslint-disable-next-line import/no-duplicates
import * as ReactGA from '../src/index';
// eslint-disable-next-line import/no-duplicates
import { __RewireAPI__ as RewireAPI } from '../src/noreact';
import initializeTests from './functionality/initialize';
import gaTests from './functionality/ga';
import setTests from './functionality/set';
import sendTests from './functionality/send';
import pageviewTests from './functionality/pageview';
import modalviewTests from './functionality/modalview';
import exceptionTests from './functionality/exception';
import timingTests from './functionality/timing';
import eventTests from './functionality/event';
import outboundLinkTests from './functionality/outboundLink';
import pluginTests from './functionality/plugin';

describe('react-ga', function () {
  const spies = {};

  beforeEach(function () {
    spies.warn = spy();
    spies.info = spy();
    spies.ga = spy();
    RewireAPI.__Rewire__('warn', spies.warn);
    RewireAPI.__Rewire__('log', spies.info);
    RewireAPI.__Rewire__('loadGA', () => {
      window.ga = spies.ga;
      return spies.ga;
    });
  });

  afterEach(function () {
    RewireAPI.__ResetDependency__('warn');
    RewireAPI.__ResetDependency__('log');
    RewireAPI.__ResetDependency__('loadGA');
  });

  it('should import as both default and * syntax', function () {
    should.deepEqual(Object.keys(DefaultReactGA).sort(), Object.keys(ReactGA).sort());
  });

  initializeTests(spies);
  gaTests(spies);
  setTests(spies);
  sendTests(spies);
  pageviewTests(spies);
  modalviewTests(spies);
  exceptionTests(spies);
  timingTests(spies);
  eventTests(spies);
  outboundLinkTests(spies);
  pluginTests(spies);
});
