import { Component, OnInit } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  
  constructor(private meta: Meta, private titleService: Title,) { }

  ngOnInit(): void {
    this.titleService.setTitle('Order It!');
    this.meta.updateTag({ name: 'title', content: 'Order It!' });
    this.meta.updateTag({ name: 'description', content: 'A app de pedidos favorita de todos os mirtilenses.' });
  }
}
