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
    try {
      let response = await axios.get(`/get/${address}`, { httpsAgent: agent });
      const expression = JSON.parse(response.data);
      return expression;
    } catch (e) {
      if (e.response.status === 404) {
        return null;
      } else {
        throw new Error(e)
      }
    }
  }
}
