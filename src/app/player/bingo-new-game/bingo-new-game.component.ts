import { HostListener, OnDestroy } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Guid } from "guid-typescript";
import { Subscription } from 'rxjs';
import { HelperBingo } from 'src/app/shared/helper.common';
import { Player } from 'src/app/shared/models/playerModel';
import { TokenModel } from 'src/app/shared/models/tokenModel';
import { NewGameService } from 'src/app/shared/newgame.service';

import { BingoResultComponent } from '../bingo-result/bingo-result.component';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-bingo-new-game',
  templateUrl: './bingo-new-game.component.html',
  styleUrls: ['./bingo-new-game.component.scss']
})

export class BingoNewGameComponent implements OnInit, OnDestroy {

  bingoNewCards: string[][] = [];

  firstRowCard: string[] = [];
  secondRowCard: string[] = [];
  thirdRowCard: string[] = [];
  fourthRowCard: string[] = [];
  fifthRowCard: string[] = [];

  diagonalFirstResult: string[] = [];
  diagonalSecondResult: string[] = [];
  userFoundCards: string[] = [];

  uniqueId: string = Guid.create().toString();

  bingoServiceSubscription = new Subscription();

  invalidName: string = '';
  deSelectMessage: string = '';

  newGameStarted = false;
  confirmResult: any;
  userName: string = '';
  employer: string = '';
  team: string = '';
  tokenToRender: string = '';
  cacheDataDays: number = 2;
  isCacheDataChecked = false;

  player = {} as Player;
  message: string = '';

  generatedTokenResponse: TokenModel;
  generatedTokens: string[] = [];

  constructor(private dialog: MatDialog, private newGameService: NewGameService, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {

    let DateCreated = new Date(HelperBingo.GetDataFromLocalStorage('DateCreated'));
    const today = new Date();
    const timeDifference = today.getTime() - DateCreated.getTime();
    const dayDifference = timeDifference / (1000 * 3600 * 24);

    if (dayDifference > this.cacheDataDays) {
      this.ClearLocalStorage();
    }

    if (this.GetLocalStorage()) {
      this.bingoNewCards.push(this.firstRowCard.slice(0, 5));
      this.bingoNewCards.push(this.secondRowCard.slice(0, 5));
      this.bingoNewCards.push(this.thirdRowCard.slice(0, 5));
      this.bingoNewCards.push(this.fourthRowCard.slice(0, 5));
      this.bingoNewCards.push(this.fifthRowCard.slice(0, 5));
      this.signalRInvoke();
      return;
    }
    else {
      this.ResetBoard();
    }

    this.CheckActiveAdmin();
    this.signalRInvoke();
  }

  ResetBoard() {
    this.bingoNewCards.length = 0;
    this.userFoundCards.length = 0;
    this.generatedTokens.length = 0;

    this.firstRowCard.length = 0;
    this.secondRowCard.length = 0;
    this.thirdRowCard.length = 0;
    this.fourthRowCard.length = 0;
    this.fifthRowCard.length = 0;

    this.diagonalFirstResult.length = 0;
    this.diagonalSecondResult.length = 0;

    this.firstRowCard = ["B1", "I1", "N1", "G1", "O1"];
    this.secondRowCard = ["B2", "I2", "N2", "G2", "O2"];
    this.thirdRowCard = ["B3", "I3", "N3", "G3", "O3"];
    this.fourthRowCard = ["B4", "I4", "N4", "G4", "O4"];
    this.fifthRowCard = ["B5", "I5", "N5", "G5", "O5"];

    this.userName = '';
    this.employer = '';
    this.team = '';
    this.newGameStarted = false;
    this.isCacheDataChecked = false;

    this.bingoNewCards.push(this.firstRowCard.slice(0, 5));
    this.bingoNewCards.push(this.secondRowCard.slice(0, 5));
    this.bingoNewCards.push(this.thirdRowCard.slice(0, 5));
    this.bingoNewCards.push(this.fourthRowCard.slice(0, 5));
    this.bingoNewCards.push(this.fifthRowCard.slice(0, 5));

    this.ClearLocalStorage();

  }

  ngOnDestroy(): void {
    if (this.bingoServiceSubscription) {
      this.bingoServiceSubscription.unsubscribe();
    }
  }

  async CreateNewBoard(): Promise<void> {

    if (this.newGameStarted) {
      await this.openDialog();
      if (this.confirmResult && this.confirmResult === true) {
        // do nothing!!
      }
      else {
        return;
      }
    }


    if (!this.confirmResult) {
      this.player.employerName = this.employer;
      this.player.teamName = this.team;
      this.player.playerName = this.userName;
      this.player.uniqueId = this.uniqueId;

      this.bingoServiceSubscription.add(this.newGameService.registerPlayer(this.player).subscribe(data => {
        //console.log(data);
      }));
    }

    this.CheckActiveAdmin();

    this.bingoNewCards.length = 0;
    this.firstRowCard.length = 0;
    this.secondRowCard.length = 0;
    this.thirdRowCard.length = 0;
    this.fourthRowCard.length = 0;
    this.fifthRowCard.length = 0;
    this.userFoundCards.length = 0;
    this.diagonalFirstResult.length = 0;
    this.diagonalSecondResult.length = 0;

    this.deSelectMessage = '';

    let sameCardData = true;
    while (sameCardData) {

      this.SetBingoData();

      if (this.BingoDataDuplicated(this.firstRowCard, this.secondRowCard) || this.BingoDataDuplicated(this.firstRowCard, this.thirdRowCard) || this.BingoDataDuplicated(this.firstRowCard, this.fourthRowCard) ||
        this.BingoDataDuplicated(this.firstRowCard, this.fifthRowCard) || this.BingoDataDuplicated(this.secondRowCard, this.thirdRowCard) || this.BingoDataDuplicated(this.secondRowCard, this.fourthRowCard) ||
        this.BingoDataDuplicated(this.secondRowCard, this.fifthRowCard) || this.BingoDataDuplicated(this.thirdRowCard, this.fourthRowCard) || this.BingoDataDuplicated(this.thirdRowCard, this.fifthRowCard) ||
        this.BingoDataDuplicated(this.fourthRowCard, this.fifthRowCard)) {
        sameCardData = true;
        this.bingoNewCards.length = 0;
        this.firstRowCard.length = 0;
        this.secondRowCard.length = 0;
        this.thirdRowCard.length = 0;
        this.fourthRowCard.length = 0;
        this.fifthRowCard.length = 0;
      }
      else {
        sameCardData = false;
      }
    }

    this.bingoNewCards.push(this.firstRowCard.slice(0, 5));
    this.bingoNewCards.push(this.secondRowCard.slice(0, 5));
    this.bingoNewCards.push(this.thirdRowCard.slice(0, 5));
    this.bingoNewCards.push(this.fourthRowCard.slice(0, 5));
    this.bingoNewCards.push(this.fifthRowCard.slice(0, 5));

    let diagonalResult = [this.firstRowCard[0], this.secondRowCard[1], this.thirdRowCard[2], this.fourthRowCard[3], this.fifthRowCard[4]];
    this.diagonalFirstResult = this.CustomBingoSort(diagonalResult);


    diagonalResult = [this.firstRowCard[4], this.secondRowCard[3], this.thirdRowCard[2], this.fourthRowCard[1], this.fifthRowCard[0]];
    this.diagonalSecondResult = this.CustomBingoSort(diagonalResult);

    this.newGameStarted = true;

    if (this.isCacheDataChecked) {
      this.SetLocalStorage();
    }

  }

  CacheData(checked: boolean) {
    this.isCacheDataChecked = checked;

    if (!this.newGameStarted) {
      return;
    }

    if (checked) {
      this.SetLocalStorage();
    }
    else {
      this.ClearLocalStorage()
    }
  }

  ResetSelection(): void {
    this.userFoundCards.length = 0;
    this.deSelectMessage = '';
  }

  CheckForBingo() {

    if (!this.newGameStarted) {
      return;
    }
    this.BingoFinalCheck(true);
  }

  FoundWord(id: any): void {
    if (!this.newGameStarted) {
      return;
    }

    if (this.userFoundCards.includes(id)) {
      const index = this.userFoundCards.indexOf(id);
      this.userFoundCards.splice(index, 1);
    }
    else {
      this.userFoundCards.push(id);
    }

    this.BingoFinalCheck(false);

  }

  OpenBingoResultComponent(): void {

    this.dialog.open(BingoResultComponent, {
      width: '800px',
      height: 'auto',
      autoFocus: false,
      data: {
        userName: this.userName
      }
    });
  }

  async NotifyAdmin() {
    this.bingoServiceSubscription.add(
      (await this.newGameService.sendNotifyAdminRequest(this.employer, this.team, this.userName, this.uniqueId, this.message)).subscribe(data => {
        //console.log(data);
      })
    );
  }

  async RequestToken() {
    this.bingoServiceSubscription.add(
      (await this.newGameService.sendTokenTokenRequest(this.employer, this.team, this.userName, this.uniqueId)).subscribe(data => {
        //console.log(data);
      })
    );
  }

  @HostListener('window:unload', ['$event'])
  unloadHandler() {

    if (!this.newGameStarted) {
      return;
    }

    if (!this.isCacheDataChecked) {
      return;
    }

    HelperBingo.StoreCardsLocalStorage('userFoundCards', this.userFoundCards);
    HelperBingo.StoreCardsLocalStorage('userName', this.userName);
    HelperBingo.StoreCardsLocalStorage('employer', this.employer);
    HelperBingo.StoreCardsLocalStorage('team', this.team);
    HelperBingo.StoreCardsLocalStorage('uniqueId', this.uniqueId);
    HelperBingo.StoreCardsLocalStorage('isCacheDataChecked', this.isCacheDataChecked);

  }

  async openDialog(): Promise<any> {

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '250px',
      data: { name: this.userName, Message: "A game is already in progress, do you still want to create new game?" }
    });

    await dialogRef.afterClosed().toPromise().then(result => {
      this.confirmResult = result;
    });

  }

  async ReloadGeneratedTokens() {
    this.bingoServiceSubscription.add(
      (await this.newGameService.getTokens(this.employer, this.team)).subscribe(data => {
        //console.log(data);
        let generatedTokenResponseTemp = {} as TokenModel;
        generatedTokenResponseTemp = data;
        if (generatedTokenResponseTemp.employerName === this.employer && generatedTokenResponseTemp.teamName === this.team) {
          this.generatedTokenResponse = generatedTokenResponseTemp;
          this.generatedTokens = this.generatedTokenResponse.tokens;
          this.tokenToRender = this.generatedTokenResponse.currentToken;
          //console.log(this.generatedTokens);
          this._snackBar.open(this.tokenToRender, 'Party!', { panelClass: ['green-snackbar'], duration: 10000 });
        }
      },
        error => {
          //console.log(error);
          // this._snackBar.open('there is a server exception, please contact  hosting team', 'Dismiss', {
          //   duration: 10000
          // });
        }));
  }

  private signalRInvoke() {
    const signalRConnection = this.newGameService.signalRConnectRequestToken();
    if (signalRConnection) {
      this._snackBar.open('You are connected to receive tokens from Admin', 'Party!', { panelClass: ['green-snackbar'], duration: 10000 });
    }
    else {
      this._snackBar.open('there is a problem in connecting with Admin, please re-load the page to try again or contact  hosting team', 'Dismiss', {
        duration: 10000
      });
    }
    signalRConnection.on("BroadcastMessage", () => {
      this.ReloadGeneratedTokens();
    });
  }

  private async CheckActiveAdmin() {
    if ((this.employer === null || this.employer === '') || (this.team === null || this.team === '')) {
      return;
    }
    this.bingoServiceSubscription.add((await this.newGameService.getAdmin(this.employer, this.team)).subscribe(data => {
      //console.log(data);
      if (data && data.includes('no admin')) {
        this._snackBar.open(data, 'Dismiss', {
          duration: 10000
        });
      }
      else {
        this._snackBar.open(data, 'Party!', { panelClass: ['green-snackbar'], duration: 10000 });
      }
    },
      error => {
        //console.log(error);
        this._snackBar.open('there is a server exception, please contact  hosting team', 'Dismiss', {
          duration: 10000
        });
      }));
  }

  private SetLocalStorage() {

    HelperBingo.StoreCardsLocalStorage('firstRowCard', this.firstRowCard);
    HelperBingo.StoreCardsLocalStorage('secondRowCard', this.secondRowCard);
    HelperBingo.StoreCardsLocalStorage('thirdRowCard', this.thirdRowCard);
    HelperBingo.StoreCardsLocalStorage('fourthRowCard', this.fourthRowCard);
    HelperBingo.StoreCardsLocalStorage('fifthRowCard', this.fifthRowCard);
    HelperBingo.StoreCardsLocalStorage('diagonalFirstResult', this.diagonalFirstResult);
    HelperBingo.StoreCardsLocalStorage('diagonalSecondResult', this.diagonalSecondResult);
    HelperBingo.StoreCardsLocalStorage('newGameStarted', this.newGameStarted);
    HelperBingo.StoreCardsLocalStorage('DateCreated', new Date().toString());
  }

  private GetLocalStorage(): boolean {

    let firstRowCardTemp = HelperBingo.GetDataFromLocalStorage('firstRowCard');
    if (firstRowCardTemp) {
      this.firstRowCard = firstRowCardTemp;
    }
    else {
      return false;
    }

    let secondRowCardTemp = HelperBingo.GetDataFromLocalStorage('secondRowCard')
    if (secondRowCardTemp) {
      this.secondRowCard = secondRowCardTemp
    }
    else {
      return false;
    }

    let thirdRowCardTemp = HelperBingo.GetDataFromLocalStorage('thirdRowCard');
    if (thirdRowCardTemp) {
      this.thirdRowCard = thirdRowCardTemp;
    }
    else {
      return false;
    }

    let fourthRowCardTemp = HelperBingo.GetDataFromLocalStorage('fourthRowCard');
    if (fourthRowCardTemp) {
      this.fourthRowCard = fourthRowCardTemp;
    }
    else {
      return false;
    }

    let fifthRowCardTemp = HelperBingo.GetDataFromLocalStorage('fifthRowCard');
    if (fifthRowCardTemp) {
      this.fifthRowCard = fifthRowCardTemp;
    }
    else {
      return false;
    }

    let diagonalFirstResultTemp = HelperBingo.GetDataFromLocalStorage('diagonalFirstResult');
    if (diagonalFirstResultTemp) {
      this.diagonalFirstResult = diagonalFirstResultTemp;
    }
    else {
      return false;
    }

    let diagonalSecondResultTemp = HelperBingo.GetDataFromLocalStorage('diagonalSecondResult');
    if (diagonalSecondResultTemp) {
      this.diagonalSecondResult = diagonalSecondResultTemp;
    }
    else {
      return false;
    }

    this.newGameStarted = HelperBingo.GetDataFromLocalStorage('newGameStarted');
    if (!this.newGameStarted) {
      return false;
    }

    let userFoundCardsTemp = HelperBingo.GetDataFromLocalStorage('userFoundCards');
    if (userFoundCardsTemp) {
      this.userFoundCards = userFoundCardsTemp;
    }
    else {
      return false;
    }

    let userNameTemp = HelperBingo.GetDataFromLocalStorage('userName');
    if (!userNameTemp) {
      return false;
    }
    else {
      this.userName = userNameTemp;
    }

    let employerTemp = HelperBingo.GetDataFromLocalStorage('employer');
    if (!employerTemp) {
      return false;
    }
    else {
      this.employer = employerTemp;
    }

    let teamTemp = HelperBingo.GetDataFromLocalStorage('team');
    if (!teamTemp) {
      return false;
    }
    else {
      this.team = teamTemp;
    }

    let uniqueIdTemp = HelperBingo.GetDataFromLocalStorage('uniqueId');
    if (!uniqueIdTemp) {
      return false;
    }
    else {
      this.uniqueId = uniqueIdTemp;
    }

    let isCacheDataCheckedTemp = HelperBingo.GetDataFromLocalStorage('isCacheDataChecked');
    if (!isCacheDataCheckedTemp) {
      this.isCacheDataChecked = isCacheDataCheckedTemp;
      return false;
    } else {
      this.isCacheDataChecked = isCacheDataCheckedTemp;
    }

    return true;

  }

  private ClearLocalStorage() {

    localStorage.removeItem('firstRowCard');
    localStorage.removeItem('secondRowCard');
    localStorage.removeItem('thirdRowCard');
    localStorage.removeItem('fourthRowCard');
    localStorage.removeItem('fifthRowCard');
    localStorage.removeItem('diagonalFirstResult');
    localStorage.removeItem('diagonalSecondResult');
    localStorage.removeItem('userName');
    localStorage.removeItem('newGameStarted');
    localStorage.removeItem('DateCreated');
    localStorage.removeItem('isCacheDataChecked');
    localStorage.removeItem('userFoundCards');
    localStorage.removeItem('displayedTokens');
    localStorage.removeItem('employer');
    localStorage.removeItem('team');
    localStorage.removeItem('uniqueId');

  }

  private BingoFinalCheck(checkBingoButtonClick: boolean) {

    let userDuplicate = false;
    this.userFoundCards.forEach(word => {
      if (!userDuplicate) {
        if (!this.generatedTokens.includes(word)) {
          if (word !== 'NLove') {
            userDuplicate = true;
          }
        }
      }
    });

    //TODO: remove the ! below
    if (userDuplicate && this.userFoundCards.length > 0) {
      this.deSelectMessage = 'Please un-select the cards that were not in the Generated List!';
      return;
    }
    else {
      this.deSelectMessage = '';
    }

    if (this.userFoundCards.length < 5) {
      return;
    }

    if (this.BingoDataCheck(this.userFoundCards, this.firstRowCard)) {
      this.OpenBingoResultComponent();

    } else if (this.BingoDataCheck(this.userFoundCards, this.secondRowCard)) {
      this.OpenBingoResultComponent();
    }
    else if (this.BingoDataCheck(this.userFoundCards, this.thirdRowCard)) {
      this.OpenBingoResultComponent();
    }
    else if (this.BingoDataCheck(this.userFoundCards, this.fourthRowCard)) {
      this.OpenBingoResultComponent();
    }
    else if (this.BingoDataCheck(this.userFoundCards, this.fifthRowCard)) {
      this.OpenBingoResultComponent();
    }
    else if (this.BingoDataCheck(this.userFoundCards, this.diagonalFirstResult)) {
      this.OpenBingoResultComponent();
    }
    else if (this.BingoDataCheck(this.userFoundCards, this.diagonalSecondResult)) {
      this.OpenBingoResultComponent();
    }
  }

  private BingoDataCheck(userFoundArray: string[], resultRowArray: string[]): boolean {
    let bingoResultArray: string[] = [];
    userFoundArray.forEach(element => {
      if (resultRowArray.includes(element)) {
        bingoResultArray.push(element);
      }
    });

    return this.BingoDataCompare(resultRowArray, bingoResultArray);
  }

  private CustomBingoSort(sortArray: string[]): string[] {

    const alphabet = 'BINGO'.split('');

    sortArray
      .sort((a, b) => {
        return alphabet.indexOf(a.substring(0, 1)) - alphabet.indexOf(b.substring(0, 1))
      })
      .join('');

    return sortArray;

  }

  private BingoDataDuplicated(firstArray: string[], secondArray: string[]): boolean {

    for (var i = 0; i < firstArray.length; i++) {
      if (firstArray[i] === secondArray[i]) {
        return true;
      }
    }
    return false;
  }

  private BingoDataCompare(bingoResultArray: string[], userInputArray: string[]): boolean {
    let userInputArraySorted = this.CustomBingoSort(userInputArray);

    let bingoExists: string[] = [];
    for (var i = 0; i < bingoResultArray.length; i++) {
      if (bingoResultArray[i] === userInputArraySorted[i]) {
        bingoExists.push(userInputArraySorted[i]);
      }
    }

    return (bingoExists.length === bingoResultArray.length && bingoExists.length === 5);
  }

  private SetBingoData() {

    const bingo = ["B", "I", "N", "G", "O"];

    for (let row = 0; row < bingo.length; row++) {
      this.firstRowCard.push(`${bingo[row]}${(Math.floor(Math.random() * 75) + 1).toString()}`);
      this.secondRowCard.push(`${bingo[row]}${(Math.floor(Math.random() * 75) + 1).toString()}`);
      if (row === 2) {
        this.thirdRowCard.push(`${bingo[row]}Love`);
      } else {
        this.thirdRowCard.push(`${bingo[row]}${(Math.floor(Math.random() * 75) + 1).toString()}`);
      }
      this.fourthRowCard.push(`${bingo[row]}${(Math.floor(Math.random() * 75) + 1).toString()}`);
      this.fifthRowCard.push(`${bingo[row]}${(Math.floor(Math.random() * 75) + 1).toString()}`);
    }
  }

}
