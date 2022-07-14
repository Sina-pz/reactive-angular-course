import { Observable } from "rxjs";
import { Component, OnInit } from "@angular/core";
import { MessagesService } from "./messages.service";
import { tap } from "rxjs/operators";

@Component({
  selector: "messages",
  templateUrl: "./messages.component.html",
  styleUrls: ["./messages.component.css"],
})
export class MessagesComponent implements OnInit {
  showMessages = false;
  error$: Observable<string[]>;
  constructor(public messagesService: MessagesService) {
    console.log("created messages component");
  }

  ngOnInit() {
    this.error$ = this.messagesService.errors$.pipe(
      tap(() => (this.showMessages = true))
    );
  }

  onClose() {
    this.showMessages = false;
  }
}
