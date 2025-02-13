export type EventType = {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  creator: string;
};

export type EventResponse = {
    publicKey: string;
    account: {
      admin: string;
      stopped: boolean;
      eventName: string;
      deposit: string; 
    }
  }
