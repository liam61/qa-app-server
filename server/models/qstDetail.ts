interface IQstDetail {
  num: number;
  type: string;
  title?: string;
  options?: IOption[];
  required?: boolean;
  reply?: { [key: string]: string[] };
}

interface IOption {
  id: string;
  value: string;
}

interface IFile {
  id: string;
  url: string;
  name?: string;
  size?: string;
  cover?: boolean;
}

export { IQstDetail, IOption, IFile };
