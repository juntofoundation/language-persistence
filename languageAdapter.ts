import type { Address, LanguageAdapter, PublicSharing, LanguageContext } from "@perspect3vism/ad4m";
import type { IPFS } from 'ipfs-core-types';
import { s3, BUCKET_NAME } from './config';

export default class LangAdapter implements LanguageAdapter {
  #IPFS: IPFS;

  putAdapter: PublicSharing;

  constructor(context: LanguageContext) {
    this.#IPFS = context.IPFS;
  }

  async getLanguageSource(address: Address): Promise<string> {
    const hash = address.toString();

    const params = {
      Bucket: BUCKET_NAME,
      Key: hash
    };
    const obj = await s3.getObject(params).promise();
  
    return obj.Body.toString('utf-8');
  }
}
