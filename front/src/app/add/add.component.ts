import {Component, Injectable, OnInit} from '@angular/core';
import {AuthService, IUser} from "../auth.service";
import {FormArray, FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {
  HttpClient, HttpRequest, HttpEvent, HttpHeaders, HttpResponse
} from "@angular/common/http"
import {Observable, of, Subject, Subscription} from "rxjs";
import {environment} from "../../environments/environment";
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from "@angular/router";
import {IGalleryItem} from "../gallery/gallery.component";
import {map, pairwise, startWith, tap} from "rxjs/operators";


@Injectable()
export class CanActivateAuthRequired implements CanActivate {
  constructor(private auth: AuthService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return of(!!this.auth.user)
  }
}

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {
  titlesFormArray = new FormArray([]);
  filesChanges$ = new Subject();
  uploadPercent;
  uploaded: Array<IGalleryItem> = [];
  files: File[];
  httpEvent: HttpEvent<{}>;

  constructor(private auth: AuthService,
              public httpClient: HttpClient) {

  }

  ngOnInit(): void {
    this.filesChanges$.pipe(
      startWith([]),
      map((files: Array<any>) => {
        return files.length
      }),
      pairwise(),

      tap(([oldFilesSize, filesSize]) => {
        const size = filesSize - oldFilesSize;
        if (size > 0) {
          for (const i of new Array(size)) {
            this.titlesFormArray.push(
              new FormControl('')
            )
          }
        } else if (!filesSize) {
          this.titlesFormArray.clear()
        }
      })
    ).subscribe()
  }

  uploadFiles(): Subscription {
    const formData = new FormData();
    this.uploaded = [];

    this.files.forEach((item: File) => {
      formData.append("files", item, item.name)
    });
    this.titlesFormArray.value.forEach((item: string) => {
      formData.append('titles', item)
    });

    const headers = new HttpHeaders(this.auth.httpOptions.headers);

    const config = new HttpRequest('POST', `${environment.backendGalery}/upload/`, formData, {
      headers: headers,
      reportProgress: true
    });
    return this.httpClient.request(config).subscribe((event: HttpResponse<Array<IGalleryItem>> | any) => {
      if (event instanceof HttpResponse) {
        this.uploaded = event.body;
        this.files = [];
        this.filesChanges$.next([]);
      } else {
        this.httpEvent = event;
      }
    })
  }

  remove(index): void {
    this.files.splice(index, 1);
    this.filesChanges$.next(this.files);
    this.titlesFormArray.removeAt(index);
  }

  init(ngf: any) {
    ngf.filesChange.subscribe((files) => {
      this.filesChanges$.next(files)
    })
  }
}
