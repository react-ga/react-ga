import * as ga from './index';

declare function describe(desc: string, f: () => void): void;
declare function it(desc: string, f: () => void): void;

describe('Testing react-ga initialize object', () => {
  it('Able to initialize react-ga object', () => {
    ga.initialize('UA-65432-1');
  });
  it('Able to initailize react-ga object', () => {
    const options: ga.InitializeOptions = {
      debug: true
    };

    ga.initialize('UA-65432-1', options);
  });

  it('Able to initialize multiple trackers', () => {
    ga.initialize([
      { trackingId: 'abc', debug: true },
      { trackingId: 'efg', debug: true, gaOptions: { name: 'blah' } }
    ]);
  });
});

describe('Testing react-ga pageview calls', () => {
  it('Able to make pageview calls', () => {
    ga.initialize('UA-65432-1');
    ga.pageview('http://telshin.com');
  });

  it('Able to make pageview calls with multiple trackers', () => {
    ga.initialize([
      { trackingId: 'abc', debug: true },
      { trackingId: 'efg', debug: true, gaOptions: { name: 'blah' } }
    ]);
    ga.pageview('http://telshin.com', ['blah']);
  });

  it('Able to make pageview calls with custom title', () => {
    ga.initialize('UA-65432-1');
    ga.pageview('http://telshin.com', undefined, 'custom title');
  });
});

describe('Testing react-ga modal calls', () => {
  it('Able to make modal calls', () => {
    ga.initialize('UA-65432-1');

    ga.modalview('Test modal');
  });
  it('Able to make modal calls with multiple trackers', () => {
    ga.initialize([
      { trackingId: 'abc', debug: true },
      { trackingId: 'efg', debug: true, gaOptions: { name: 'blah' } }
    ]);
    ga.modalview('Test modal', ['blah']);
  });
});

describe('Testing react-ga event calls', () => {
  const options: ga.EventArgs = {
    category: 'Test',
    action: 'CI',
    label: 'Running Jasmine tests for react-ga typscript library',
    value: 4,
    nonInteraction: true
  };

  it('Able to make event calls', () => {
    ga.initialize('UA-65432-1');

    ga.event(options);
  });
  it('Able to make event calls with multiple trackers', () => {
    ga.initialize([
      { trackingId: 'abc', debug: true },
      { trackingId: 'efg', debug: true, gaOptions: { name: 'blah' } }
    ]);

    ga.event(options, ['blah']);
  });

  it('Able to pass custom dimensions with events', () => {
    const payloadWithDimensions: ga.EventArgs = {
      dimension1: 'foo',
      dimension20: 'bar',
      ...options
    };
    ga.initialize('UA-65432-1');

    ga.event(payloadWithDimensions);
  });

  it('Able to pass custom metrics with events', () => {
    const payloadWithmetrics: ga.EventArgs = {
      metric1: 1,
      metric20: 2.99,
      ...options
    };
    ga.initialize('UA-65432-1');

    ga.event(payloadWithmetrics);
  });
});

describe('Testing react-ga set calls', () => {
  const fieldObject: ga.FieldsObject = {
    page: '/users'
  };

  it('Able to make set calls', () => {
    ga.initialize('UA-65432-1');

    ga.set(fieldObject);
  });
  it('Able to make set calls with multiple trackers', () => {
    ga.initialize([
      { trackingId: 'abc', debug: true },
      { trackingId: 'efg', debug: true, gaOptions: { name: 'blah' } }
    ]);

    ga.set(fieldObject, ['blah']);
  });
});

describe('Testing react-ga v2.1.2', () => {
  it('Able to make ga calls', () => {
    ga.ga();
  });
  it('Able to make send calls', () => {
    let fieldObject: ga.FieldsObject = {
      page: '/users'
    };

    ga.send(fieldObject, []);
  });
  it('Able to make timing calls', () => {
    ga.timing(
      {
        category: 'string',
        variable: 'string',
        value: 1,
        label: 'string'
      },
      []
    );
  });
  it('Able to make exception calls', () => {
    let fieldObject: ga.FieldsObject = {
      page: '/users'
    };
    ga.exception(fieldObject, []);
  });
  it('Able to make plugin object calls', () => {
    const execute = ga.plugin.execute;
    const require = ga.plugin.require;
    const payload = {};

    execute('name', 'action', payload);
    execute('name', 'action', 'type', payload);
    require('name', {});
    require('name', {}, 'trackerName');
  });
  it('Able to make outboundLink calls', () => {
    ga.outboundLink({ label: 'string' }, () => {}, []);
  });
});
