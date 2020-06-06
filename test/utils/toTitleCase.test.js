import toTitleCase from '../../src/utils/toTitleCase';

describe('toTitleCase()', () => {
  // Tests taken from https://github.com/gouch/to-title-case/blob/master/test/tests.json
  it('should convert correctly to title case', () => {
    expect(toTitleCase('follow step-by-step instructions')).toEqual(
      'Follow Step-by-Step Instructions'
    );
    expect(toTitleCase('this sub-phrase is nice')).toEqual(
      'This Sub-Phrase Is Nice'
    );
    expect(toTitleCase('catchy title: a subtitle')).toEqual(
      'Catchy Title: A Subtitle'
    );
    expect(toTitleCase("catchy title: 'a quoted subtitle'")).toEqual(
      "Catchy Title: 'A Quoted Subtitle'"
    );
    expect(toTitleCase('catchy title: "\'a twice quoted subtitle\'"')).toEqual(
      'Catchy Title: "\'A Twice Quoted Subtitle\'"'
    );
    expect(toTitleCase("'a title inside double quotes'")).toEqual(
      "'A Title Inside Double Quotes'"
    );
    expect(toTitleCase('all words capitalized')).toEqual(
      'All Words Capitalized'
    );
    expect(toTitleCase('small words are for by and of lowercase')).toEqual(
      'Small Words Are for by and of Lowercase'
    );
    expect(toTitleCase('a small word starts')).toEqual('A Small Word Starts');
    expect(toTitleCase('a small word it ends on')).toEqual(
      'A Small Word It Ends On'
    );
    expect(toTitleCase('do questions work?')).toEqual('Do Questions Work?');
    expect(toTitleCase('multiple sentences. more than one.')).toEqual(
      'Multiple Sentences. More Than One.'
    );
    expect(toTitleCase('Ends with small word of')).toEqual(
      'Ends With Small Word Of'
    );
    expect(toTitleCase("double quoted 'inner' word")).toEqual(
      "Double Quoted 'Inner' Word"
    );
    expect(toTitleCase("single quoted 'inner' word")).toEqual(
      "Single Quoted 'Inner' Word"
    );
    expect(toTitleCase('fancy double quoted "inner" word')).toEqual(
      'Fancy Double Quoted "Inner" Word'
    );
    expect(toTitleCase("fancy single quoted 'inner' word")).toEqual(
      "Fancy Single Quoted 'Inner' Word"
    );
    expect(toTitleCase('this vs. that')).toEqual('This vs. That');
    expect(toTitleCase('this vs that')).toEqual('This vs That');
    expect(toTitleCase('this v. that')).toEqual('This v. That');
    expect(toTitleCase('this v that')).toEqual('This v That');
    expect(toTitleCase('address email@example.com titles')).toEqual(
      'Address email@example.com Titles'
    );
    expect(toTitleCase('pass camelCase through')).toEqual(
      'Pass camelCase Through'
    );
    expect(toTitleCase("don't break")).toEqual("Don't Break");
    expect(toTitleCase('catchy title: substance subtitle')).toEqual(
      'Catchy Title: Substance Subtitle'
    );
    expect(toTitleCase('we keep NASA capitalized')).toEqual(
      'We Keep NASA Capitalized'
    );
    expect(toTitleCase('leave Q&A unscathed')).toEqual('Leave Q&A Unscathed');
    expect(
      toTitleCase('Scott Moritz and TheStreet.com’s million iPhone la-la land')
    ).toEqual('Scott Moritz and TheStreet.com’s Million iPhone La-La Land');
    expect(toTitleCase('you have a http://example.com/foo/ title')).toEqual(
      'You Have a http://example.com/foo/ Title'
    );
    expect(toTitleCase('your hair[cut] looks (nice)')).toEqual(
      'Your Hair[cut] Looks (Nice)'
    );
    expect(toTitleCase('keep that colo(u)r')).toEqual('Keep That Colo(u)r');
    expect(toTitleCase('have you read "The Lottery"?')).toEqual(
      'Have You Read "The Lottery"?'
    );
    expect(
      toTitleCase(
        'Read markdown_rules.txt to find out how _underscores around words_ will be interpreted'
      )
    ).toEqual(
      'Read markdown_rules.txt to Find Out How _Underscores Around Words_ Will Be Interpreted'
    );
    expect(
      toTitleCase(
        'Read markdown_rules.txt to find out how *asterisks around words* will be interpreted'
      )
    ).toEqual(
      'Read markdown_rules.txt to Find Out How *Asterisks Around Words* Will Be Interpreted'
    );
    expect(
      toTitleCase(
        'Notes and observations regarding Apple’s announcements from ‘The Beat Goes On’ special event'
      )
    ).toEqual(
      'Notes and Observations Regarding Apple’s Announcements From ‘The Beat Goes On’ Special Event'
    );
    expect(
      toTitleCase('Drink this piña colada while you listen to ænima')
    ).toEqual('Drink This Piña Colada While You Listen to Ænima');
    expect(toTitleCase('capitalize hyphenated words on-demand')).toEqual(
      'Capitalize Hyphenated Words On-Demand'
    );
    expect(toTitleCase('take them on: special lower cases')).toEqual(
      'Take Them On: Special Lower Cases'
    );
  });
});
