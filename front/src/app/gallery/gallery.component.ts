import {Component, OnInit} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {AuthService} from "../auth.service";

export interface IGalleryItem {
  id: number;
  is_owner: boolean;
  user: string;

  title: string;
  image: string;
  thumb: string;

  like_count: number;
  comment_count: number;
}

interface IOffset {
  count: number;
  next: string | null;
  previous: string | null;
  results: Array<IGalleryItem>;
}

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {
  offset: IOffset;
  items: Array<IGalleryItem> = [];

  constructor(private http: HttpClient, private auth: AuthService) {
    this.getItems()
  }

  getItems(url?: string): void {
    this.http.get(url ? url : `${environment.backendGalery}/list/`).subscribe((value: IOffset) => {
      this.offset = value;
      this.items.push(...value.results);
    })
  }

  remove(index: number): void {
    this.http.delete(`${environment.backendGalery}/${this.items[index].id}/`, this.auth.httpOptions).subscribe(() => {
      this.items.splice(index, 1);
    })
  }

  ngOnInit(): void {
  }

}
