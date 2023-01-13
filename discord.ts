import axios from 'axios';
import toml from 'toml';
import * as fs from 'fs';
import path from 'path';

interface secr {
  cookie: string;
  authorization: string;
}
const MSG_API = 'https://discord.com/api/v9/channels/';
//example:https://discord.com/api/v9/channels/758343656595390465/messages?after=758392255681134623&limit=50
const secr = fs.readFileSync('./discord.secr', 'utf-8');
const { cookie, authorization } = toml.parse(secr) as unknown as secr;

interface IObject {
  [key: string]: any;
}
const getMsg = async ({ channelID, last }: Record<string, string>) => {
  let axiosres;
  try {
    axiosres = await axios.get(
      `${MSG_API}${channelID}/messages${last == '0' ? '' : `?before=${last}`}`,
      {
        headers: {
          cookie: cookie,
          authorization: authorization,
        },
      }
    );
  } catch (error) {
    console.log(error);
    process.exit(0);
  }
  return axiosres.data;
};
const main = async (channelID: string) => {
  let db: IObject[] = [];
  let msg = (await getMsg({ channelID, last: '0' })) as unknown as IObject[];
  console.log(`get ${msg.length} messages`);
  db = db.concat(msg);
  let last = msg.at(-1)?.id;
  while (msg.length !== 0) {
    msg = await getMsg({ channelID, last });
    console.log(`get ${msg.length} messages`);
    if (msg.length !== 0) db = db.concat(msg);
    last = msg.at(-1)?.id;
  }
  fs.writeFile(
    path.resolve(__dirname, './', `${channelID}.json`),
    JSON.stringify(db, null, 2),
    () => {
      console.log('done');
    }
  );
};
main('758343656595390465');
