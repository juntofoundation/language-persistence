import type { Address, AgentService, PublicSharing, HolochainLanguageDelegate, IPFSNode, LanguageContext, LanguageLanguageInput} from "@perspect3vism/ad4m";
import https from "https";

export default function sleep(ms: number): Promise<any> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class IpfsPutAdapter implements PublicSharing {
  #agent: AgentService;
  #IPFS: IPFSNode;

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

    var postData = JSON.stringify({
      key: hash,
      expression,
    });

    const options = {
      hostname: "language-store.jdeepee.repl.co",
      port: 443,
      path: '/store',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }

    await new Promise((resolve, reject) => {
      var req = https.request(options);
      
      req.on('error', (e) => {
        console.log(`LanguageLanguage: problem with request: ${e.message}`);
        throw new Error(e.message)
      });
      
      // write data to request body
      req.write(postData);
      req.end();
      resolve("Finished")
    })
    await sleep(20)
    return hash as Address;
  }
}
