import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Constants } from 'src/environments/constants';
import { EncryptDecrypt } from './crypto';

import { Admin } from './models/adminModel';
import { Player } from './models/playerModel';

//import * as CryptoJS from 'crypto-js';
import * as signalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class NewGameService {

  private bingoServerAPI = `${Constants.BINGO_SERVER_API_PATH_BASE}`;
  private appSecret = `${Constants.APP_SECRET}`;
  //userNameEncrypted = userNameEncrypted.replace('/','vnaa');

  constructor(private http: HttpClient) {
  }

  async adminLogin(userName: string, password: string): Promise<Observable<any>> {
    const keyRandom = Math.random().toFixed(16).split('.')[1];
    let key: any;
    await import('crypto-js')
      .then(module => {
        key = module.enc.Utf8.parse(keyRandom);
      })
      .catch(err => {
        console.log(err.message);
      });

    let userNameEncrypted = await EncryptDecrypt.encryptUsingAES256(userName, key);
    userNameEncrypted = encodeURIComponent(userNameEncrypted);

    let passwordEncrypted = await EncryptDecrypt.encryptUsingAES256(password, key);
    passwordEncrypted = encodeURIComponent(passwordEncrypted);

    return this.http.get<Observable<Admin>>(`${this.bingoServerAPI}adminLogin/${this.appSecret}?wohoo=${keyRandom}&userName=${userNameEncrypted}&password=${passwordEncrypted}`);
  }

  registerAdmin(admin: Admin): Observable<any> {
    const keyRandom = Math.random().toFixed(16).split('.')[1];
    return this.http.post<Admin>(`${this.bingoServerAPI}insertAdmin/${this.appSecret}?wohoo=${keyRandom}`, admin);
  }

  resetAdmin(admin: Admin, reset: string): Observable<any> {
    const keyRandom = Math.random().toFixed(16).split('.')[1];
    return this.http.put<Admin>(`${this.bingoServerAPI}updateAdmin/${this.appSecret}/${reset}?wohoo=${keyRandom}`, admin);
  }

  async getAdmin(employerName: string, teamName: string): Promise<Observable<any>> {
    const keyRandom = Math.random().toFixed(16).split('.')[1];
    let key: any;
    await import('crypto-js')
      .then(module => {
        key = module.enc.Utf8.parse(keyRandom);
      })
      .catch(err => {
        console.log(err.message);
      });

    //const key = CryptoJS.enc.Utf8.parse(keyRandom);

    let employerNameEncrypted = await EncryptDecrypt.encryptUsingAES256(employerName, key);
    employerNameEncrypted = encodeURIComponent(employerNameEncrypted);

    let teamNameEncrypted = await EncryptDecrypt.encryptUsingAES256(teamName, key);
    teamNameEncrypted = encodeURIComponent(teamNameEncrypted);

    return this.http.get<Observable<Admin>>(`${this.bingoServerAPI}getAdmin/${this.appSecret}?wohoo=${keyRandom}&employerName=${employerNameEncrypted}&teamName=${teamNameEncrypted}`);
  }

  registerPlayer(player: Player) {
    const keyRandom = Math.random().toFixed(16).split('.')[1];
    return this.http.post<Admin>(`${this.bingoServerAPI}insertPlayer/${this.appSecret}?wohoo=${keyRandom}`, player);
  }

  signalRConnectRequestToken() {
    const connection = new signalR.HubConnectionBuilder()
      .configureLogging(signalR.LogLevel.Information)
      .withUrl(this.bingoServerAPI + 'notify', {
        //skipNegotiation: true,
        transport: signalR.HttpTransportType.LongPolling
      })
      .build();

    connection.start().then(function () {
       transport: ['webSockets', 'longPolling']
      //console.log('SignalR Connected!');
    }).catch(function (err) {
      return console.error(err.toString());
    });

    return connection;
  }

  async sendToken(employerName: string, teamName: string, token: string): Promise<Observable<any>> {
    const keyRandom = Math.random().toFixed(16).split('.')[1];
    let key: any;
    await import('crypto-js')
      .then(module => {
        key = module.enc.Utf8.parse(keyRandom);
      })
      .catch(err => {
        console.log(err.message);
      });

    //const key = CryptoJS.enc.Utf8.parse(keyRandom);

    let employerNameEncrypted = await EncryptDecrypt.encryptUsingAES256(employerName, key);
    employerNameEncrypted = encodeURIComponent(employerNameEncrypted);

    let teamNameEncrypted = await EncryptDecrypt.encryptUsingAES256(teamName, key);
    teamNameEncrypted = encodeURIComponent(teamNameEncrypted);

    return this.http.get<Observable<any>>(`${this.bingoServerAPI}sendToken/${this.appSecret}?wohoo=${keyRandom}&employerName=${employerNameEncrypted}&teamName=${teamNameEncrypted}&token=${token}`);
  }

  async sendTokenTokenRequest(employerName: string, teamName: string, playerName: string, uniqueId: string): Promise<Observable<any>> {
    const keyRandom = Math.random().toFixed(16).split('.')[1];
    let key: any;
    await import('crypto-js')
      .then(module => {
        key = module.enc.Utf8.parse(keyRandom);
      })
      .catch(err => {
        console.log(err.message);
      });

    //const key = CryptoJS.enc.Utf8.parse(keyRandom);

    let employerNameEncrypted = await EncryptDecrypt.encryptUsingAES256(employerName, key);
    employerNameEncrypted = encodeURIComponent(employerNameEncrypted);

    let teamNameEncrypted = await EncryptDecrypt.encryptUsingAES256(teamName, key);
    teamNameEncrypted = encodeURIComponent(teamNameEncrypted);


    let playerNameEncrypted = await EncryptDecrypt.encryptUsingAES256(playerName, key);
    playerNameEncrypted = encodeURIComponent(playerNameEncrypted);

    return this.http.get<Observable<any>>(`${this.bingoServerAPI}sendTokenRequest/${this.appSecret}?wohoo=${keyRandom}&employerName=${employerNameEncrypted}&teamName=${teamNameEncrypted}&playerName=${playerNameEncrypted}&uniqueId=${uniqueId}`);

  }

  async sendNotifyAdminRequest(employerName: string, teamName: string, playerName: string, uniqueId: string, message: string): Promise<Observable<any>> {
    const keyRandom = Math.random().toFixed(16).split('.')[1];
    let key: any;
    await import('crypto-js')
      .then(module => {
        key = module.enc.Utf8.parse(keyRandom);
      })
      .catch(err => {
        console.log(err.message);
      });

    //const key = CryptoJS.enc.Utf8.parse(keyRandom);

    let employerNameEncrypted = await EncryptDecrypt.encryptUsingAES256(employerName, key);
    employerNameEncrypted = encodeURIComponent(employerNameEncrypted);

    let teamNameEncrypted = await EncryptDecrypt.encryptUsingAES256(teamName, key);
    teamNameEncrypted = encodeURIComponent(teamNameEncrypted);


    let playerNameEncrypted = await EncryptDecrypt.encryptUsingAES256(playerName, key);
    playerNameEncrypted = encodeURIComponent(playerNameEncrypted);

    return this.http.get<Observable<any>>(`${this.bingoServerAPI}notifyAdmin/${this.appSecret}?wohoo=${keyRandom}&employerName=${employerNameEncrypted}&teamName=${teamNameEncrypted}&playerName=${playerNameEncrypted}&uniqueId=${uniqueId}&message=${message}`);
  }

  async getTokens(employerName: string, teamName: string): Promise<Observable<any>> {
    const keyRandom = Math.random().toFixed(16).split('.')[1];
    let key: any;
    await import('crypto-js')
      .then(module => {
        key = module.enc.Utf8.parse(keyRandom);
      })
      .catch(err => {
        console.log(err.message);
      });

    //const key = CryptoJS.enc.Utf8.parse(keyRandom);

    let employerNameEncrypted = await EncryptDecrypt.encryptUsingAES256(employerName, key);
    employerNameEncrypted = encodeURIComponent(employerNameEncrypted);

    let teamNameEncrypted = await EncryptDecrypt.encryptUsingAES256(teamName, key);
    teamNameEncrypted = encodeURIComponent(teamNameEncrypted);

    return this.http.get<Observable<any>>(`${this.bingoServerAPI}getTokens/${this.appSecret}?wohoo=${keyRandom}&employerName=${employerNameEncrypted}&teamName=${teamNameEncrypted}`);

  }

  async getPlayers(employerName: string, teamName: string): Promise<Observable<any>> {
    const keyRandom = Math.random().toFixed(16).split('.')[1];
    let key: any;
    await import('crypto-js')
      .then(module => {
        key = module.enc.Utf8.parse(keyRandom);
      })
      .catch(err => {
        console.log(err.message);
      });

    //const key = CryptoJS.enc.Utf8.parse(keyRandom);

    let employerNameEncrypted = await EncryptDecrypt.encryptUsingAES256(employerName, key);
    employerNameEncrypted = encodeURIComponent(employerNameEncrypted);

    let teamNameEncrypted = await EncryptDecrypt.encryptUsingAES256(teamName, key);
    teamNameEncrypted = encodeURIComponent(teamNameEncrypted);

    return this.http.get<Observable<any>>(`${this.bingoServerAPI}getPlayers/${this.appSecret}?wohoo=${keyRandom}&employerName=${employerNameEncrypted}&teamName=${teamNameEncrypted}`);
  }

  async deletePlayer(employerName: string, teamName: string, uniqueId: string): Promise<Observable<any>> {
    const keyRandom = Math.random().toFixed(16).split('.')[1];
    let key: any;
    await import('crypto-js')
      .then(module => {
        key = module.enc.Utf8.parse(keyRandom);
      })
      .catch(err => {
        console.log(err.message);
      });

    //const key = CryptoJS.enc.Utf8.parse(keyRandom);

    let employerNameEncrypted = await EncryptDecrypt.encryptUsingAES256(employerName, key);
    employerNameEncrypted = encodeURIComponent(employerNameEncrypted);

    let teamNameEncrypted = await EncryptDecrypt.encryptUsingAES256(teamName, key);
    teamNameEncrypted = encodeURIComponent(teamNameEncrypted);

    return this.http.delete<Observable<any>>(`${this.bingoServerAPI}deletePlayer/${this.appSecret}?wohoo=${keyRandom}&employerName=${employerNameEncrypted}&teamName=${teamNameEncrypted}&uniqueId=${uniqueId}`);
  }

  async deletePlayers(employerName: string, teamName: string): Promise<Observable<any>> {
    const keyRandom = Math.random().toFixed(16).split('.')[1];
    let key: any;
    await import('crypto-js')
      .then(module => {
        key = module.enc.Utf8.parse(keyRandom);
      })
      .catch(err => {
        console.log(err.message);
      });

    //const key = CryptoJS.enc.Utf8.parse(keyRandom);

    let employerNameEncrypted = await EncryptDecrypt.encryptUsingAES256(employerName, key);
    employerNameEncrypted = encodeURIComponent(employerNameEncrypted);

    let teamNameEncrypted = await EncryptDecrypt.encryptUsingAES256(teamName, key);
    teamNameEncrypted = encodeURIComponent(teamNameEncrypted);

    return this.http.delete<Observable<any>>(`${this.bingoServerAPI}deletePlayers/${this.appSecret}?wohoo=${keyRandom}&employerName=${employerNameEncrypted}&teamName=${teamNameEncrypted}`);
  }

  async deleteTokens(employerName: string, teamName: string): Promise<Observable<any>> {
    const keyRandom = Math.random().toFixed(16).split('.')[1];
    let key: any;
    await import('crypto-js')
      .then(module => {
        key = module.enc.Utf8.parse(keyRandom);
      })
      .catch(err => {
        console.log(err.message);
      });

    //const key = CryptoJS.enc.Utf8.parse(keyRandom);

    let employerNameEncrypted = await EncryptDecrypt.encryptUsingAES256(employerName, key);
    employerNameEncrypted = encodeURIComponent(employerNameEncrypted);

    let teamNameEncrypted = await EncryptDecrypt.encryptUsingAES256(teamName, key);
    teamNameEncrypted = encodeURIComponent(teamNameEncrypted);

    return this.http.delete<Observable<any>>(`${this.bingoServerAPI}deleteTokens/${this.appSecret}?wohoo=${keyRandom}&employerName=${employerNameEncrypted}&teamName=${teamNameEncrypted}`);
  }
}
