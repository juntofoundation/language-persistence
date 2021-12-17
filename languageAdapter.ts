import type { Address, LanguageAdapter, PublicSharing, LanguageContext } from "@perspect3vism/ad4m";
import type { IPFS } from 'ipfs-core-types';
import axios from "axios";
import { GET_ENDPOINT } from "./config";

export default class LangAdapter implements LanguageAdapter {
  #IPFS: IPFS;

  putAdapter: PublicSharing;

  constructor(context: LanguageContext) {
    this.#IPFS = context.IPFS;
  }

  async getLanguageSource(address: Address): Promise<string> {
    const getResult = await axios.get(`${GET_ENDPOINT}?hash=${address}`);
    if (getResult.status != 200) {
      console.error("Get language content with error: ", getResult);
    }

    return getResult.data;
  }
}
