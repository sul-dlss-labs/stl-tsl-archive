This repository contains a configuration for archiving the [The Special Tribunal for Lebanon] using [browsertrix-crawler]. It contains a [custom-behavior] to automatically select and download PDFs that aren't fetched by browsertrix-crawler's standard behaviors or Archive-It.

To run the crawl you should install Docker and then run the `run.sh` script. This should run for about 8-9 hours, and at the end you should find a WACZ file in `collections/stl-tsl/stl-tsl.wacz` which you can view in ArchiveWebPage. In the case of the SDR it was accessioned using the WAS Registrar App.

[The Special Tribunal for Lebanon]: https://www.stl-tsl.org/en
[browsertrix-crawler]: https://github.com/webrecorder/browsertrix-behavior
[custom-behavior]: https://github.com/webrecorder/browsertrix-crawler#additional-custom-behaviors
