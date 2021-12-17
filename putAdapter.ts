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
    const ipfsAddress = await this.#IPFS.add(
      { content: language.bundle.toString()},
      { onlyHash: true},
    );
    // @ts-ignore
    const hash = ipfsAddress.cid.toString();

    if(hash != language.meta.address)
      throw new Error(`Language Persistence: Can't store language. Address stated in meta differs from actual file\nWanted: ${language.meta.address}\nGot: ${hash}`)

    const agent = this.#agent;
    const expression = agent.createSignedExpression(language.meta);

    const httpsAgent = new https.Agent({
      rejectUnauthorized: false
    });
    const uploadEndpoint = "https://bi8fgdofma.execute-api.us-west-2.amazonaws.com/dev/serverlessSetup/upload";
    const metaPostData = {
      hash: `meta-${hash}`,
      content: JSON.stringify(expression),
    };
    const metaPostResult = await axios.post(uploadEndpoint, metaPostData, { httpsAgent });
    if (metaPostResult.status != 200) {
      console.error("Upload language meta data gets error: ", metaPostResult);
    }

    const langPostData = {
      hash,
      content: language.bundle.toString()
    }
    const langPostResult = await axios.post(uploadEndpoint, langPostData, { httpsAgent });
    if (langPostResult.status != 200) {
      console.error("Upload language gets error: ", langPostResult);
    }

    return hash as Address;
  }
}
