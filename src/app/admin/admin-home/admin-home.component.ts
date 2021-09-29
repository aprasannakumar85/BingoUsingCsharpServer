import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { EncryptDecrypt } from 'src/app/shared/crypto';
import { HelperBingo } from 'src/app/shared/helper.common';
import { Admin } from 'src/app/shared/models/adminModel';
import { NewGameService } from 'src/app/shared/newgame.service';
import { Constants } from 'src/environments/constants';
//import * as CryptoJS from 'crypto-js';
import * as signalR from '@microsoft/signalr';
import { Subscription } from 'rxjs';
import { TokenModel } from 'src/app/shared/models/tokenModel';
import { Player } from 'src/app/shared/models/playerModel';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.scss']
})
export class AdminHomeComponent implements OnInit, OnDestroy {

  adminData: Admin;
  bingoServiceSubscription = new Subscription();
  generatedToken: string = '';
  generatedTokenResponse: TokenModel;
  generatedTokens: string[] = [];
  players = {} as Player[];
  signalRConnection: signalR.HubConnection;

  constructor(private router: Router, private newGameService: NewGameService, private _snackBar: MatSnackBar) {
    this.adminData = this.router.getCurrentNavigation()?.extras.state as Admin;
    //console.log(this.adminData);
  }

  ngOnDestroy(): void {
    if (this.bingoServiceSubscription) {
      this.bingoServiceSubscription.unsubscribe();
    }
    if (this.signalRConnection) {
      this.signalRConnection.stop();
    }
  }

  ngOnInit(): void {
    if (!this.adminData) {
      this.router.navigate(['/admin']);
    }
    this.signalRInvoke("BroadcastRequestToken");
    this.signalRInvoke("BroadcastRequestMessage");
  }

  SignOut() {
    localStorage.removeItem('wth');
    localStorage.removeItem('kamal');
    this.router.navigate(['/admin']);
  }

  ToggleActive(activate: boolean) {
    this.adminData.isActive = activate;
    this.bingoServiceSubscription.add(this.newGameService.resetAdmin(this.adminData, "false").subscribe(async data => {
      //console.log(data);
      if (HelperBingo.GetDataFromLocalStorage('wth')) {
        localStorage.removeItem('wth');
        let key: any;
        await import('crypto-js')
          .then(module => {
            key = module.enc.Utf8.parse(`${Constants.randomNumber}`);
          })
          .catch(err => {
            console.log(err.message);
          });
        //const key = CryptoJS.enc.Utf8.parse(`${Constants.randomNumber}`);
        const adminDataEncrypted = EncryptDecrypt.encryptUsingAES256(this.adminData, key);
        HelperBingo.StoreCardsLocalStorage('wth', adminDataEncrypted);
      }

      this.signalRInvoke("BroadcastRequestMessage");
      this.signalRInvoke("BroadcastRequestToken");
    },
      error => {
        //console.log(error);
        this._snackBar.open('there is a server exception, please contact  hosting team', 'Dismiss', {
          duration: 10000
        });
      }));
  }

  SignOutAndInactive() {
    if (this.adminData.isActive) {
      this.ToggleActive(false);
    }
    this.SignOut();
  }

  GenerateToken() {
    const bingo = ["B", "I", "N", "G", "O"];
    const randomLetter = bingo[Math.floor(Math.random() * bingo.length)];
    const randomNumber = (Math.floor(Math.random() * 75) + 1).toString()

    this.generatedToken = `${randomLetter}${randomNumber}`;

  }

  async SendToken() {
    this.bingoServiceSubscription.add((await this.newGameService.sendToken(this.adminData.employerName, this.adminData.teamName, this.generatedToken)).
      subscribe(data => {
        //console.log(data);
        this.generatedToken = '';
        this.ReloadGeneratedTokens();
      },
        error => {
          console.log(error);
          this._snackBar.open('there is a server exception, please contact  hosting team', 'Dismiss', {
            duration: 10000
          });
        }));
  }

  async ReloadGeneratedTokens() {
    this.generatedTokens.length = 0;
    this.bingoServiceSubscription.add(
      (await this.newGameService.getTokens(this.adminData.employerName, this.adminData.teamName)).subscribe(data => {
        //console.log(data.tokens);
        this.generatedTokenResponse = data;
        this.generatedTokens = this.generatedTokenResponse.tokens;
      },
        error => {
          //console.log(error);
          this._snackBar.open('there is a server exception, please contact  hosting team', 'Dismiss', {
            duration: 10000
          });
        }));
  }

  async DeleteTokens() {
    this.bingoServiceSubscription.add(
      (await this.newGameService.deleteTokens(this.adminData.employerName, this.adminData.teamName)).subscribe(data => {
        //console.log(data);
        this.generatedTokens.length = 0;
        this.generatedTokenResponse = {} as TokenModel;
      },
        error => {
          //console.log(error);
          this._snackBar.open('there is a server exception, please contact  hosting team', 'Dismiss', {
            duration: 10000
          });
        })
    );
  }

  async GetPlayers() {
    this.bingoServiceSubscription.add(
      (await this.newGameService.getPlayers(this.adminData.employerName, this.adminData.teamName)).subscribe(data => {
        //console.log(data);
        this.players = data;
      },
        error => {
          //console.log(error);
          this._snackBar.open('there is a server exception, please contact  hosting team', 'Dismiss', {
            duration: 10000
          });
        }));
  }

  async DeletePlayers() {
    this.bingoServiceSubscription.add(
      (await this.newGameService.deletePlayers(this.adminData.employerName, this.adminData.teamName)).subscribe(data => {
        //console.log(data);
        this.players = {} as Player[];
      },
        error => {
          //console.log(error);
          this._snackBar.open('there is a server exception, please contact  hosting team', 'Dismiss', {
            duration: 10000
          });
        })
    );
  }

  async DeletePlayer(player: Player) {
    this.bingoServiceSubscription.add(
      (await this.newGameService.deletePlayer(this.adminData.employerName, this.adminData.teamName, player.uniqueId)).subscribe(data => {
        //console.log(data);
        const index = this.players.indexOf(player, 0);
        if (index > -1) {
          this.players.splice(index, 1);
        }
      },
        error => {
          //console.log(error);
          this._snackBar.open('there is a server exception, please contact  hosting team', 'Dismiss', {
            duration: 10000
          });
        })
    );
  }

  private signalRInvoke(broadCastType: string) {
    if (!this.adminData) {
      return;
    }

    if (this.adminData && !this.adminData.isActive) {
      //console.log(this.signalRConnection.state);
      if (this.signalRConnection && this.signalRConnection.state === 'Connected') {
        this.signalRConnection.stop();
        //console.log(this.signalRConnection.state);
        this._snackBar.open('You are disconnected from notifications from players', 'Dismiss', { panelClass: ['green-snackbar'], duration: 5000 });
      }
      return;
    }

    this.signalRConnection = this.newGameService.signalRConnectRequestToken();
    if (this.signalRConnection) {
      this._snackBar.open('You are connected to receive notifications from players', 'Party!', { panelClass: ['green-snackbar'], duration: 10000 });
      //console.log(this.signalRConnection.state);
    }
    else {
      this._snackBar.open('there is a problem in connecting with Admin, please re-load the page to try again or contact  hosting team', 'Dismiss', {
        duration: 10000
      });
      //console.log(this.signalRConnection.state);
      return;
    }

    if (broadCastType === 'BroadcastRequestToken') {
      this.signalRConnection.on(broadCastType, (requestModel) => {
        // console.log(requestModel);
        if (requestModel.employerName === this.adminData.employerName && requestModel.teamName === this.adminData.teamName) {
          this._snackBar.open(`${requestModel.playerName} from ${requestModel.employerName} - ${requestModel.teamName} is ${requestModel.message}`, 'Dismiss', {
            duration: 10000
          });
        }
      });
    }
    else {
      this.signalRConnection.on(broadCastType, (requestModel) => {
        // console.log(requestModel);
        if (requestModel.employerName === this.adminData.employerName && requestModel.teamName === this.adminData.teamName) {
          this._snackBar.open(`Message from ${requestModel.playerName} of ${requestModel.employerName} - ${requestModel.teamName}: ${requestModel.message}`, 'Dismiss', {
            duration: 10000
          });
        }
      });
    }
  }
}
