import * as ReactGA from '../../src';

export default function pluginTests(spies) {
  describe('Plugin', function () {
    it('should require the plugin: ecommerce', function () {
      ReactGA.initialize('plugin');
      ReactGA.plugin.require('ecommerce');

      spies.ga.args.should.eql([
        ['create', 'plugin', 'auto'],
        ['require', 'ecommerce']
      ]);
    });

    it('should execute ecommerce:addItem', function () {
      ReactGA.initialize('plugin');
      ReactGA.plugin.execute('ecommerce', 'addItem', {
        id: 1,
        name: 'Product'
      });

      spies.ga.args.should.eql([
        ['create', 'plugin', 'auto'],
        ['ecommerce:addItem', { id: 1, name: 'Product' }]
      ]);
    });

    it('should execute ec:setAction \'checkout\' with payload { \'step\': 1 }', function () {
      ReactGA.initialize('plugin');
      ReactGA.plugin.execute('ec', 'setAction', 'checkout', { step: 1 });
      spies.ga.args.should.eql([
        ['create', 'plugin', 'auto'],
        ['ec:setAction', 'checkout', { step: 1 }]
      ]);
    });

    it('should execute ecommerce:send', function () {
      ReactGA.initialize('plugin');
      ReactGA.plugin.execute('ecommerce', 'send');
      spies.ga.args.should.eql([
        ['create', 'plugin', 'auto'],
        ['ecommerce:send']
      ]);
    });
  });
}
