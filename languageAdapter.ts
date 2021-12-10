import type { Address, LanguageAdapter, PublicSharing, LanguageContext } from "@perspect3vism/ad4m";
import type { IPFS } from 'ipfs-core-types';
import { s3, BUCKET_NAME } from './config';
import { GetObjectCommand } from "@aws-sdk/client-s3";
import type { Readable } from "stream";

async function streamToString (stream: Readable): Promise<string> {
  return await new Promise((resolve, reject) => {
    const chunks: Uint8Array[] = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
  });
}

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
    const data = await s3.send(new GetObjectCommand(params));

    const contents = await streamToString(data.Body as Readable);
  
    return contents;
  }
}
