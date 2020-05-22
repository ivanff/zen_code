import {Component, OnDestroy, OnInit} from '@angular/core';
import {IGalleryItem} from "../gallery/gallery.component";
import {ActivatedRoute, ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from "@angular/router";
import {Observable, of, ReplaySubject} from "rxjs";
import {AuthService, IUser} from "../auth.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {takeUntil} from "rxjs/operators";

export class GalleryItemResolver implements Resolve<IGalleryItem> {
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return of({
      id: 1,
      user: 'agestart@gmail.com',
      title: 'test',
      image: 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__340.jpg',
      thumb: 'https://clipart.info/images/ccovers/1559064731google-small.png',
      like_count: 0,
      comment_count: 1,
    } as IGalleryItem);
  }
}

export class GalleryCommentsResolver implements Resolve<Array<IComment>> {
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return of([
      {
        user: 'myname',
        content: "<b>sdfsdfds</b>test test",
        created: new Date()
      }
    ]);
  }
}

interface IComment {
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
              private auth: AuthService) {
    this.item = this.route.snapshot.data['item'];
    this.comments = this.route.snapshot.data['comments'];
    console.log('GalleryItemComponent')
  }

  ngOnInit(): void {
    this.commentForm = this.formBuilder.group({
      content: ['', [Validators.required, Validators.maxLength(250)]]
    });
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
      ++this.item.like_count
    }
  }

  onSubmit(value): void {
    if (!this.auth.user) {

    } else {
      if (this.auth.user) {
        if (this.commentForm.status == 'VALID') {
          this.comments.unshift({
            user: this.auth.getUserName(),
            content: value.content,
            created: new Date(),
          } as IComment);
          this.commentForm.reset();
          ++this.item.comment_count;
        }
      }
    }
  }
}
