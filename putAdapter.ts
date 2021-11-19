import type { Address, AgentService, PublicSharing, LanguageContext, LanguageLanguageInput} from "@perspect3vism/ad4m";
import axios from "axios";
import https from "https";
import type { IPFS } from "ipfs-core-types";

export default function sleep(ms: number): Promise<any> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class IpfsPutAdapter implements PublicSharing {
  #agent: AgentService;
  #IPFS: IPFS;

  constructor(context: LanguageContext) {
    this.#agent = context.agent;
    this.#IPFS = context.IPFS;
  }

  async createPublic(language: LanguageLanguageInput): Promise<Address> {
    const ipfsAddress = await this.#IPFS.add({
      content:  language.bundle.toString(),
    });
    // @ts-ignore
    const hash = ipfsAddress.cid.toString();

    if(hash != language.meta.address)
      throw new Error(`Language Persistence: Can't store language. Address stated in meta differs from actual file\nWanted: ${language.meta.address}\nGot: ${hash}`)

    const agent = this.#agent;
    const expression = agent.createSignedExpression(language.meta);

    var postData = {
      key: hash,
      expression,
    };

    const httpsAgent = new https.Agent({
        rejectUnauthorized: false
    });
    axios.defaults.baseURL = "https://language-store.jdeepee.repl.co";
    let post = await axios.post("/store", postData, { httpsAgent });
    return hash as Address;
  }
}
