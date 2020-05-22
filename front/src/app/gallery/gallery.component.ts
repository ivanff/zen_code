import {Component, OnInit} from '@angular/core';

export interface IGalleryItem {
  id: number;
  user: string;

  title: string;
  image: string;
  thumb: string;

  like_count: number;
  comment_count: number;
}

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {
  items: Array<IGalleryItem> = [
    {
      id: 1,
      user: 'agestart@gmail.com',
      title: 'test',
      image: 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__340.jpg',
      thumb: 'https://clipart.info/images/ccovers/1559064731google-small.png',
      like_count: 0,
      comment_count: 1,
    }
  ];

  constructor() {
  }

  ngOnInit(): void {
  }

}
