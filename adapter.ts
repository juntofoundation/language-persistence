import type { Address, Expression, ExpressionAdapter, PublicSharing, HolochainLanguageDelegate, LanguageContext } from "@perspect3vism/ad4m";
import { IpfsPutAdapter } from "./putAdapter";
import https from "https";

export default class Adapter implements ExpressionAdapter {

  putAdapter: PublicSharing;

  constructor(context: LanguageContext) {
    this.putAdapter = new IpfsPutAdapter(context);
  }

  //@ts-ignore
  async get(address: Address): Promise<void | Expression> {
    let request_call = new Promise((resolve, reject) => {
      https.get(`https://language-store.jdeepee.repl.co/get/${address}`, (response) => {
        let chunks_of_data = [];
    
        response.on('data', (fragments) => {
          chunks_of_data.push(fragments);
        });
    
        response.on('end', () => {
          let response_body = Buffer.concat(chunks_of_data);
          
          // promise resolved on success
          resolve({body: response_body.toString(), status: response.statusCode!});
        });
    
        response.on('error', (error) => {
          // promise rejected on error
          reject(error);
        });
      });
    });

    let response = await request_call;
    //@ts-ignore
    if (response.status == 404) return null
    //@ts-ignore
    const expression = JSON.parse(JSON.parse(response.body));
    return expression as Expression;
  }
}
