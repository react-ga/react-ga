var should = require('should');

var toTitleCase = require('../../src/utils/toTitleCase');

describe('toTitleCase()', function () {
  // Tests taken from https://github.com/gouch/to-title-case/blob/master/test/tests.json
  it('should convert correctly to title case', function () {
     // jscs:disable
    toTitleCase('follow step-by-step instructions')
      .should.eql('Follow Step-by-Step Instructions');
    toTitleCase('this sub-phrase is nice')
      .should.eql('This Sub-Phrase Is Nice');
    toTitleCase('catchy title: a subtitle')
      .should.eql('Catchy Title: A Subtitle');
    toTitleCase('catchy title: \'a quoted subtitle\'')
      .should.eql('Catchy Title: \'A Quoted Subtitle\'');
    toTitleCase('catchy title: "\'a twice quoted subtitle\'"')
      .should.eql('Catchy Title: "\'A Twice Quoted Subtitle\'"');
    toTitleCase('\'a title inside double quotes\'')
      .should.eql('\'A Title Inside Double Quotes\'');
    toTitleCase('all words capitalized')
      .should.eql('All Words Capitalized');
    toTitleCase('small words are for by and of lowercase')
      .should.eql('Small Words Are for by and of Lowercase');
    toTitleCase('a small word starts')
      .should.eql('A Small Word Starts');
    toTitleCase('a small word it ends on')
      .should.eql('A Small Word It Ends On');
    toTitleCase('do questions work?')
      .should.eql('Do Questions Work?');
    toTitleCase('multiple sentences. more than one.')
      .should.eql('Multiple Sentences. More Than One.');
    toTitleCase('Ends with small word of')
      .should.eql('Ends With Small Word Of');
    toTitleCase('double quoted \'inner\' word')
      .should.eql('Double Quoted \'Inner\' Word');
    toTitleCase('single quoted \'inner\' word')
      .should.eql('Single Quoted \'Inner\' Word');
    toTitleCase('fancy double quoted "inner" word')
      .should.eql('Fancy Double Quoted "Inner" Word');
    toTitleCase('fancy single quoted \'inner\' word')
      .should.eql('Fancy Single Quoted \'Inner\' Word');
    toTitleCase('this vs. that')
      .should.eql('This vs. That');
    toTitleCase('this vs that')
      .should.eql('This vs That');
    toTitleCase('this v. that')
      .should.eql('This v. That');
    toTitleCase('this v that')
      .should.eql('This v That');
    toTitleCase('address email@example.com titles')
      .should.eql('Address email@example.com Titles');
    toTitleCase('pass camelCase through')
      .should.eql('Pass camelCase Through');
    toTitleCase('don\'t break')
      .should.eql('Don\'t Break');
    toTitleCase('catchy title: substance subtitle')
      .should.eql('Catchy Title: Substance Subtitle');
    toTitleCase('we keep NASA capitalized')
      .should.eql('We Keep NASA Capitalized');
    toTitleCase('leave Q&A unscathed')
      .should.eql('Leave Q&A Unscathed');
    toTitleCase('Scott Moritz and TheStreet.com’s million iPhone la-la land')
      .should.eql('Scott Moritz and TheStreet.com’s Million iPhone La-La Land');
    toTitleCase('you have a http://example.com/foo/ title')
      .should.eql('You Have a http://example.com/foo/ Title');
    toTitleCase('your hair[cut] looks (nice)')
      .should.eql('Your Hair[cut] Looks (Nice)');
    toTitleCase('keep that colo(u)r')
      .should.eql('Keep That Colo(u)r');
    toTitleCase('have you read "The Lottery"?')
      .should.eql('Have You Read "The Lottery"?');
    toTitleCase('Read markdown_rules.txt to find out how _underscores around words_ will be interpreted')
      .should.eql('Read markdown_rules.txt to Find Out How _Underscores Around Words_ Will Be Interpreted');
    toTitleCase('Read markdown_rules.txt to find out how *asterisks around words* will be interpreted')
      .should.eql('Read markdown_rules.txt to Find Out How *Asterisks Around Words* Will Be Interpreted');
    toTitleCase('Notes and observations regarding Apple’s announcements from ‘The Beat Goes On’ special event')
      .should.eql('Notes and Observations Regarding Apple’s Announcements From ‘The Beat Goes On’ Special Event');
    toTitleCase('Drink this piña colada while you listen to ænima')
      .should.eql('Drink This Piña Colada While You Listen to Ænima');
    toTitleCase('capitalize hyphenated words on-demand')
      .should.eql('Capitalize Hyphenated Words On-Demand');
    toTitleCase('take them on: special lower cases')
      .should.eql('Take Them On: Special Lower Cases');
    // jscs:enable
  });
});
