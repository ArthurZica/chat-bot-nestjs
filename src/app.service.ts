import { Injectable } from '@nestjs/common';
import { create, Whatsapp } from "venom-bot"; // Remove unnecessary imports
import { Res } from '@nestjs/common';

interface Session {
  key: string;
  client: Whatsapp;
}

@Injectable()
export class AppService {
  activeSessions: Session[] = []; // Use a typed array for activeSessions

  async verifySession(key: string): Promise<Whatsapp | undefined> {
    const session = this.activeSessions.find(e => e.key === key);
    if (session) {
      return session.client;
    } else {
      console.log("Sessão não encontrada: Iniciando Sessão...");
      return undefined;
    }
  }

  async startVenomSession(key: string): Promise<Whatsapp | undefined> {
    try {
      const clientWpp = await create(key);
      this.start(clientWpp, key);
      console.log("Sessão iniciada com sucesso.", this.activeSessions);
      return clientWpp;
    } catch (error) {
      console.log(error);
      return undefined;
    }
  }

  private start(client: Whatsapp, key: string) {
    this.activeSessions.push({ key, client });
    client.onMessage(message => {
      console.log(message.body);
    });
  }

  async sendMessage(number: string, message: string, key: string, res: any) {
    try {
      const clientWpp = await this.verifySession(key);
      if (!clientWpp) {
        // Start a new session if not found
        this.startVenomSession(key);
        return res.send("Sessão iniciada, tente enviar a mensagem novamente.");
      }
      const result = await clientWpp.sendText(`${number}@c.us`, message);
      console.log(result);
      return res.send(result);
    } catch (error) {
      console.error('Error when sending: ', error);
      return res.send(error);
    }
  }

  async getContacts(res: any) {
    try {
      const clientWpp = this.activeSessions[0]?.client; // Assuming you want to fetch contacts from the first active session
      if (!clientWpp) {
        return res.send("Sessão não encontrada. Inicie uma sessão para obter contatos.");
      }

      const contacts = await clientWpp.getAllContacts();
      console.log(contacts);
      res.send(contacts);
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }
}
