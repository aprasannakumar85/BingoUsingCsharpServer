import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-bingo-admin',
  templateUrl: './bingo-admin.component.html',
  styleUrls: ['./bingo-admin.component.scss']
})
export class BingoAdminComponent implements OnInit, OnDestroy {

  ngOnInit(): void {
    localStorage.setItem('isInitialized', 'true');
  }

  ngOnDestroy(): void {
    localStorage.removeItem('isInitialized');
  }

}
