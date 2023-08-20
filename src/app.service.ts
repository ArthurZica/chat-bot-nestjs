import { Injectable } from '@nestjs/common';
import { create, Whatsapp, Message, SocketState } from "venom-bot"
import { Res } from '@nestjs/common';


@Injectable()
export class AppService {
  clientWpp: any;

  getHello(): string {
    return 'Hello World!';
  }

  async startVenomSession(key: string, res: any) {
    try {
      this.clientWpp = await create(key, undefined, (statusSession, session) => {
        console.log('Status Session: ', statusSession);
        console.log('Session name: ', session);
      });
      this.start(this.clientWpp);
    } catch (error) {
      console.log(error);
    }
  }

  private start(client: any) {
    client.onMessage((message) => {
      if (message.body === 'Hi' && message.isGroupMsg === false) {
        client.sendText(message.from, 'Olá eu sou um bot');
      }
    });
  }

  async sendMessage(number: string, message: string, res: any) {
    console.log(this.clientWpp)
    if (!this.clientWpp) {
      console.log("Cliente do WhatsApp não está pronto ainda.");
      return;
    }

    console.log("client", this.clientWpp);
    try {
      const result = await this.clientWpp.sendText(`${number}@c.us`, message);
      return res.send(result.status);
    } catch (error) {
      console.error('Error when sending: ', error); //return object error
      return res.send(error);
    }
  }

  async getContacts(res : any) {
    try {
      await this.clientWpp.getAllContacts()
        .then((contacts) => {
          console.log(contacts);
          res.send(contacts);
        }
        );
    } catch (error) {
      console.log(error);
      res.send(error);
    }


  }

}
