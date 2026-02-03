declare module "pdf-parse" {
  interface PDFInfo {
    numpages?: number;
    numrender?: number;
    info?: any;
    metadata?: any;
    text: string;
    version?: string;
  }

  function pdf(data: Buffer | Uint8Array): Promise<PDFInfo>;

  export = pdf; // <-- important: CommonJS style, nu `export default`
}
