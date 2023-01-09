import axios from 'axios';
import cheerio from 'cheerio';

const main = async (url: string) => {
  let content;
  try {
    content = await axios.get(url);
  } catch (e) {
    console.log(e);
    process.exit(0);
  }
  const $ = cheerio.load(content.data);
  let posts = $('.post__thumbnail > a');
  console.log(`${posts.length} pictures`);
};
main(process.argv[2]);
