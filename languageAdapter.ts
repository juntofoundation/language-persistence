import type { Address, LanguageAdapter, PublicSharing, LanguageContext } from "@perspect3vism/ad4m";
import type { IPFS } from 'ipfs-core-types';
import { BUCKET_NAME, s3 } from "./config";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { streamToString } from "./util";
import type { Readable } from "stream";

export default class LangAdapter implements LanguageAdapter {
  #IPFS: IPFS;

  putAdapter: PublicSharing;

  constructor(context: LanguageContext) {
    this.#IPFS = context.IPFS;
  }

  async getLanguageSource(address: Address): Promise<string> {
    const cid = address.toString();

    const params = {
      Bucket: BUCKET_NAME,
      Key: cid,
    };

    const response = await s3.send(new GetObjectCommand(params));
    const contents = await streamToString(response.Body as Readable);

    return contents;
  }
}
