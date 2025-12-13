
import { env } from "$env/dynamic/private"
import crypto from "crypto"

export async function getApiSignature(parameters: string, api_key: string): Promise<string> {
  const rawString = `api_key${api_key}${parameters}${env.SECRET}`;
  const signature = crypto.createHash("md5").update(rawString).digest("hex");
  console.log(signature)
  return signature;
}