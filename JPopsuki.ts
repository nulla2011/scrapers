import Axios from 'axios';
import fs from 'fs';
import toml from 'toml';
import { load } from 'cheerio';

const ajax = 'https://jpopsuki.eu/ajax.php?section=torrents&order_by=s4&order_way=ASC';
const secr = fs.readFileSync('./JPopsuki.secr', 'utf-8');
const { PHPSESSID } = toml.parse(secr);

const main = async () => {
  for (let i = 0; i < 6; i++) {
    const page = await Axios.get(`${ajax}&page=${i + 1}`, {
      headers: {
        cookie: `PHPSESSID=${PHPSESSID}`,
      },
    })
      .then((r) => r.data)
      .catch((e) => console.error(e));
    const $ = load(page);
    const singleTorrents = $('.torrent_table .torrent_redline');
    const groupedTorrents = $('.torrent_table .group_torrent_redline');
    for (const tr of singleTorrents) {
      fs.appendFileSync(
        'dl.txt',
        'https://jpopsuki.eu/' + $('td:nth-child(4) span a', tr).attr('href') + '\n'
      );
    }
    for (const tr of groupedTorrents) {
      fs.appendFileSync(
        'dl.txt',
        'https://jpopsuki.eu/' + $('td:nth-child(1) span a', tr).attr('href') + '\n'
      );
    }
  }
};

main();
