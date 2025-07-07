import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';

@Injectable()
export class OrderStreamService {
  private orderUpdateSubject = new Subject<any>();

  getOrderStream() {
    return this.orderUpdateSubject.asObservable();
  }

  broadcastOrderUpdate(type: string, order?: any, orderId?: number) {
    const data = { type, order, orderId };
    this.orderUpdateSubject.next(data);
  }
}
