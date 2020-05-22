import {Component, OnInit} from '@angular/core';
import {AuthService} from "../auth.service";
import {FormBuilder} from "@angular/forms";
import {
  HttpClient, HttpRequest, HttpResponse, HttpEvent
} from "@angular/common/http"
import {Subscription} from "rxjs";
import {environment} from "../../environments/environment";

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {
  formData: FormData = new FormData();
  files: File[];
  httpEvent: HttpEvent<{}>;

  constructor(private auth: AuthService,
              public httpClient: HttpClient,
              private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
  }

  uploadFiles(): Subscription {
    this.files.forEach((item: File) => {
      this.formData.append("file", item, item.name)
    });

    const config = new HttpRequest('POST', `${environment.backend}upload/`, this.formData, {
      reportProgress: true
    });
    return this.httpClient.request(config).subscribe((event) => {
      this.httpEvent = event
    })
  }
}
