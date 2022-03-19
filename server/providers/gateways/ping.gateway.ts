import { UseGuards } from '@nestjs/common';
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from '@nestjs/websockets';
import { GatewayJwtBody } from 'server/decorators/gateway_jwt_body.decorator';
import { JwtBodyDto } from 'server/dto/jwt_body.dto';
import { Server, Socket } from 'socket.io';
import { GatewayAuthGuard } from '../guards/gatewayauth.guard';
import { JwtService } from '../services/jwt.service';

class JoinPayload {
  currentRoom?: string;
  newRoom: string;
}

class PingPayload {
  currentRoom: string;
}

@WebSocketGateway()
export class PingGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private jwtService: JwtService) {}

  afterInit(server: Server) {
    console.log('Sockets initialized');
  }

  handleConnection(client: Socket) {
    // you can do things like add users to rooms
    // or emit events here.
    // IMPORTANT! The GatewayAuthGuard doesn't trigger on these handlers
    // if you need to do anything in this method you need to authenticate the JWT
    // manually.
    console.log('Connected');
    // try {
    //   const jwt = client.handshake.auth.token;
    //   const jwtBody = this.jwtService.parseToken(jwt);
    //   console.log(client.handshake.query);
    //   console.log('Client Connected: ', jwtBody.userId);
    // } catch (e) {
    //   throw new WsException('Invalid token');
    // }
  }

  handleDisconnect(client: Socket) {
    console.log('Client Disconnected');
  }

  @SubscribeMessage('unity-update')
  public handlePing(client, message: string) {
    this.server.emit('unity-update', message);
  }
}
