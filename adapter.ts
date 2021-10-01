import type { Address, Expression, ExpressionAdapter, PublicSharing, HolochainLanguageDelegate, LanguageContext } from "@perspect3vism/ad4m";
import { IpfsPutAdapter } from "./putAdapter";
import axios from "axios";
import https from "https";

export default class Adapter implements ExpressionAdapter {

  putAdapter: PublicSharing;

  constructor(context: LanguageContext) {
    this.putAdapter = new IpfsPutAdapter(context);
  }

  //@ts-ignore
  async get(address: Address): Promise<void | Expression> {
    const agent = new https.Agent({
        rejectUnauthorized: false
    });

    axios.defaults.baseURL = "https://language-store.jdeepee.repl.co";
    let response = await axios.get(`/get/${address}`, { httpsAgent: agent });
    if (response.status === 404) { return null }
    console.log(response.data);
    const expression = JSON.parse(response.data);
    return expression as Expression;
  }
}
