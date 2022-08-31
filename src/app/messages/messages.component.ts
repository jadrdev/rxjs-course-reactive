import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import {Message} from '../model/message';
import {tap} from 'rxjs/operators';
import { MessagesServices } from './messages.services';

@Component({
  selector: 'messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  showMessage = false

  errors$: Observable<string[]>


  constructor(
    public MessagesServices: MessagesServices
  ) {

    console.log("Creado el servicio de mensaje")

  }

  ngOnInit() {

    this.errors$ = this.MessagesServices.error$
      .pipe(
        tap(() => this.showMessage = true)
      )


  }


  onClose() {
    this.showMessage = false
  }

}
