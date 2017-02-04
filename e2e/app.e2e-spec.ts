import { ChromeToDoPage } from './app.po';

describe('chrome-to-do App', function() {
  let page: ChromeToDoPage;

  beforeEach(() => {
    page = new ChromeToDoPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
