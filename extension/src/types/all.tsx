type Message = {
  time: string;
  data: string;
};

type Error = {
  time: string;
  data: string;
};

type Messages = Message[];

type Errors = Error[];

export type {Message, Error, Messages, Errors }