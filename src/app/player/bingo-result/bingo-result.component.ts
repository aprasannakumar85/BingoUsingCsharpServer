import { Component, ElementRef, Inject, OnInit, Renderer2 } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as confetti from 'canvas-confetti';

@Component({
  selector: 'app-bingo-result',
  templateUrl: './bingo-result.component.html',
  styleUrls: ['./bingo-result.component.scss']
})
export class BingoResultComponent implements OnInit {

  userName: string = '';

  constructor(public dialogRef: MatDialogRef<BingoResultComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private renderer2: Renderer2, private elementRef: ElementRef) { }

  ngOnInit(): void {

    this.userName = this.data['userName'];

    const canvas = this.renderer2.createElement('canvas');

    this.renderer2.appendChild(this.elementRef.nativeElement, canvas);

    const myConfetti = confetti.create(canvas, {
      resize: true,
      useWorker: true
    });

    myConfetti({
      particleCount: 100,
      spread: 360,
      shapes: ['square']
    });

    myConfetti();
  }

}
