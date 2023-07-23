import { Injectable } from '@nestjs/common';
import { create, Whatsapp, Message, SocketState } from "venom-bot"
import { Res } from '@nestjs/common';


@Injectable()
export class AppService {
  clientWpp: any;

  getHello(): string {
    return 'Hello World!';
  }

  async startVenomSession() {
    try {
      this.clientWpp = await create('sessionName', undefined, (statusSession, session) => {
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

  async sendMessage(number: string, message: string) {
    console.log(this.clientWpp)
    if (!this.clientWpp) {
      console.log("Cliente do WhatsApp não está pronto ainda.");
      return;
    }

    console.log("client", this.clientWpp);
    try {
      const result = await this.clientWpp.sendText(`${number}@c.us`, message);
      console.log('Result: ', result); //return object success
      return result;
    } catch (error) {
      console.error('Error when sending: ', error); //return object error
      return error;
    }
  }

  async getContacts(res) {
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
