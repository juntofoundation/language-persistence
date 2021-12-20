import type { Address, Expression, ExpressionAdapter, PublicSharing, LanguageContext } from "@perspect3vism/ad4m";
import { IpfsPutAdapter } from "./putAdapter";
import { BUCKET_NAME, s3 } from "./config";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import type { Readable } from "stream";
import { streamToString } from "./util";

export default class Adapter implements ExpressionAdapter {

  putAdapter: PublicSharing;

  constructor(context: LanguageContext) {
    this.putAdapter = new IpfsPutAdapter(context);
  }

  //@ts-ignore
  async get(address: Address): Promise<void | Expression> {
    const metadataHash = `meta-${address}`;

    const params = {
      Bucket: BUCKET_NAME,
      Key: metadataHash,
    };

    const response = await s3.send(new GetObjectCommand(params));
    const contents = await streamToString(response.Body as Readable);

    return JSON.parse(contents);
  }
}
