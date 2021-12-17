import type { Address, Expression, ExpressionAdapter, PublicSharing, LanguageContext } from "@perspect3vism/ad4m";
import { IpfsPutAdapter } from "./putAdapter";
import axios from "axios";
import { GET_ENDPOINT } from "./config";

export default class Adapter implements ExpressionAdapter {

  putAdapter: PublicSharing;

  constructor(context: LanguageContext) {
    this.putAdapter = new IpfsPutAdapter(context);
  }

  //@ts-ignore
  async get(address: Address): Promise<void | Expression> {

    const metadataHash = `meta-${address}`;
    const getResult = await axios.get(`${GET_ENDPOINT}?hash=${metadataHash}`);
    if (getResult.status != 200) {
      console.error("Get language metadata with error: ", getResult);
    }

    return getResult.data;
  }
}
