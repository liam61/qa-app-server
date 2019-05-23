import { provide } from '../ioc/ioc';
import TYPES from '../constant/types';
import { IFile } from './qstDetail';

export interface IQuestion {
  readonly id: string;
  title: string;
  content: string;
  files: IFile[];
  secret: boolean;
  anonymous: boolean;
  showAuthor: boolean;
  expire: string;
  type: string;
  date: string;
  author: string;
  avatar: string;
  read: number;
  unread: number;
}

type receiverType = { [key in 'department' | 'account']?: string[] };

@provide(TYPES.Question)
export class Question implements IQuestion {
  constructor(
    public readonly id: string,
    public title: string,
    public content: string,
    public files: IFile[],
    public secret: boolean,
    public anonymous: boolean,
    public showAuthor: boolean,
    public expire: string,
    public type: string,
    public date: string,
    public author: string,
    public avatar: string,
    public read: number,
    public unread: number
  ) {}
}
