declare module '@turbodocx/html-to-docx' {
  interface DocumentMargins {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
    header?: number;
    footer?: number;
    gutter?: number;
  }

  interface PageSize {
    width?: number;
    height?: number;
  }

  interface DocumentOptions {
    orientation?: 'portrait' | 'landscape';
    pageSize?: PageSize;
    margins?: DocumentMargins;
    title?: string;
    subject?: string;
    creator?: string;
    keywords?: string[];
    description?: string;
    lastModifiedBy?: string;
    revision?: number;
    createdAt?: Date;
    modifiedAt?: Date;
    headerType?: 'default' | 'first' | 'even';
    header?: boolean;
    footerType?: 'default' | 'first' | 'even';
    footer?: boolean;
    font?: string;
    fontSize?: number;
    complexScriptFontSize?: number;
  }

  export default function HTMLtoDOCX(
    htmlString: string, 
    headerHTMLString?: string, 
    documentOptions?: DocumentOptions, 
    footerHTMLString?: string
  ): Promise<Buffer>;
}