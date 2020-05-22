import {Component, Injectable, OnDestroy, OnInit} from '@angular/core';
import {IGalleryItem} from "../gallery/gallery.component";
import {ActivatedRoute, ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from "@angular/router";
import {Observable, of, ReplaySubject} from "rxjs";
import {AuthService, IUser} from "../auth.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {map, takeUntil} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable()
export class GalleryItemResolver implements Resolve<IGalleryItem> {
  constructor(private http: HttpClient) {

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return this.http.get(`${environment.backendGalery}/${route.params['id']}/`);
  }
}

@Injectable()
export class GalleryCommentsResolver implements Resolve<Array<IComment>> {
  constructor(private http: HttpClient) {

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return this.http.get(`${environment.backendGalery}/${route.params['id']}/comment/list/`);
  }
}

interface IComment {
  id: number;
  user: string;
  content: string;
  created: Date;
}

@Component({
  selector: 'app-gallery-item',
  templateUrl: './gallery-item.component.html',
  styleUrls: ['./gallery-item.component.scss']
})
export class GalleryItemComponent implements OnInit, OnDestroy {
  private _destroy = new ReplaySubject();
  item: IGalleryItem;
  comments: Array<IComment>;
  commentForm: FormGroup;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private formBuilder: FormBuilder,
              private auth: AuthService,
              private http: HttpClient) {
    this.item = this.route.snapshot.data['item'];
    this.comments = this.route.snapshot.data['comments'];
  }

  ngOnInit(): void {
    this.commentForm = this.formBuilder.group({
      content: ['', [Validators.required, Validators.maxLength(250)]]
    });
    this.auth.user = {email: 'test@sdfds', name: ''} as IUser;
    if (!this.auth.user) {
      this.commentForm.disable();
    }
    this.auth.user$.pipe(
      takeUntil(this._destroy)
    ).subscribe((value: IUser | null) => {
      if (value) {
        this.commentForm.enable()
      } else {
        this.commentForm.disable()
      }
    })
  }

  ngOnDestroy(): void {
    this._destroy.next(null);
    this._destroy.complete()
  }

  like(): void {
    if (!this.auth.user) {
      this.router.navigate(['/login'])
    } else {
      this.http.post(`${environment.backendGalery}/like/`, {
        gallery_item: this.route.snapshot.params["id"]
      }, this.auth.httpOptions).subscribe((value) => {
        ++this.item.like_count;
      });
    }
  }

  onSubmit(value): void {
    if (!this.auth.user) {
      this.router.navigate(['/login'])
    } else {
      if (this.auth.user) {
        if (this.commentForm.status == 'VALID') {
          const data = Object.assign({
            gallery_item: this.route.snapshot.params["id"]
          }, value);

          this.http.post(`${environment.backendGalery}/comment/`, data, this.auth.httpOptions).subscribe((value) => {
            this.comments.unshift(value as IComment);
            this.commentForm.reset();
            ++this.item.comment_count;
          });
        }
      }
    }
  }
}
