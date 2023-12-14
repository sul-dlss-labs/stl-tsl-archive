class PdfBehavior {
  static id = 'PdfBehavior';

  static init() {
    return {
      pdfs: 0,
      pages: 0
    };
  }

  static isMatch() {
    return !!window.location.href.match(/www.stl-tsl.org/);
  }

  constructor() {
    this.seenPages = new Set();
    this.pdfs = [];
  }

  /**
   * Download documents from every page.
   */
  async* run(ctx) {
    const { getState, sleep, waitUnit } = ctx.Lib;
    yield getState(ctx, "Starting PdfBehavior");

    // let the page redirect if necessary
    await sleep(waitUnit);

    let page = 1;
    this.seenPages.add(1);
    while (page != 0) {
      yield getState(ctx, `Found page ${page}`);
      yield* this.getDocs(ctx);
      page = await this.nextPage(ctx);
      yield getState(ctx, `Next page is ${page}`);
    }

    yield getState(ctx, 'PdfBehavior complete.');
  }

  /**
   * Try to get a new page of results that hasn't been seen.
   */
  async nextPage(ctx) {
    const { sleep, waitUnit } = ctx.Lib;

    for (const page of document.querySelectorAll('#pagination a')) {
      const n = Number.parseInt(page.text);
      if (n && !this.seenPages.has(n)) {
        this.seenPages.add(n);
        page.click();
        await sleep(waitUnit * 2);
        return n
      }
    }

    return 0;
  }

  /**
   * Get all the docs on the page.
   */
  async* getDocs(ctx) {
    const { getState } = ctx.Lib;

    const docLinks = document.querySelectorAll('a.file-details ');
    yield getState(ctx, `Found ${docLinks.length} links`);

    for (const docLink of docLinks) {
      yield* this.getDoc(ctx, docLink);
      yield* this.closeModal(ctx);
    }
  }

  /**
   * Download the PDF for a particular document link.
   */
  async* getDoc(ctx, docLink) {
    const { getState, sleep, waitUnit } = ctx.Lib;

    // The last three elements on a page o longer available to be clicked which causes the browser 
    // to return to the homepage. It's not clear why this happens, but they need
    // to be ignored.
    if (window.getComputedStyle(docLink).display == '') {
      yield getState(ctx, 'ignoring docLink element that is no longer displayed');
      return;
    }

    // click the document button which triggers an API call and populates a
    // modal to download the PDF
    yield getState(ctx, `clicking record link ${docLink.dataset.recordFile}`);

    docLink.click();
    await sleep(waitUnit * 2);

    // Get the PDF
    const pdf = document.querySelector('div.download a.fileURL');
    if (pdf && pdf.href && pdf.href.endsWith('.pdf')) {
      yield getState(ctx, `Downloading PDF ${pdf.href}`, 'pdfs');
      this.pdfs.push(pdf.href);

      // don't open a new tab every time
      pdf.target = 'pdf';
      pdf.click();

      await sleep(waitUnit * 8);
    }
  }

  /**
   * Close the modal that opens when downloading a PDF.
   */
  async* closeModal(ctx) {
    const { sleep, waitUnit } = ctx.Lib;
    const button = document.querySelector('button.modalClose');
    if (button) {
      button.click();
    }
    await sleep(waitUnit * 2);
  }
}
