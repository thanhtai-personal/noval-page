// src/modules/crawler/crawler.gateway.ts
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Injectable } from '@nestjs/common';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class CrawlerGateway {
  @WebSocketServer()
  server: Server;

  sendCrawlInfo(sourceId: string, message: string) {
    this.server.emit(`crawl:${sourceId}`, message);
  }

  sendStatus(sourceId: string, status: 'crawling' | 'idle') {
    this.server.emit(`crawl:status:${sourceId}`, status);
  }
}
