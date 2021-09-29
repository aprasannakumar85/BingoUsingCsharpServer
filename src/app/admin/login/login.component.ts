import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { EncryptDecrypt } from 'src/app/shared/crypto';
import { HelperBingo } from 'src/app/shared/helper.common';
import { Admin } from 'src/app/shared/models/adminModel';
import { NewGameService } from 'src/app/shared/newgame.service';
import { Constants } from 'src/environments/constants';
//import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  @ViewChild(NgForm) loginForm: NgForm;

  userName: string = '';
  password: string = '';
  adminData: Admin;
  rememberAccount: boolean = false;

  bingoServiceSubscription: any;

  get isDirty(): boolean {
    return this.loginForm.dirty ? true : false;
  }
  constructor(private router: Router, private newGameService: NewGameService,
    private _snackBar: MatSnackBar) { }

  async ngOnInit(): Promise<void> {

    let DateCreated = new Date(HelperBingo.GetDataFromLocalStorage('kamal'));
    const today = new Date();
    const timeDifference = today.getTime() - DateCreated.getTime();
    const dayDifference = timeDifference / (1000 * 3600 * 24);

    if (dayDifference > 1) {
      localStorage.removeItem('wth');
      localStorage.removeItem('kamal');
    }

    let adminDataTemp = HelperBingo.GetDataFromLocalStorage('wth');
    if (adminDataTemp) {
      let key: any;
      await import('crypto-js')
        .then(async module => {
          key = module.enc.Utf8.parse(`${Constants.randomNumber}`);
        })
        .catch(err => {
          console.log(err.message);
        });

       //key = CryptoJS.enc.Utf8.parse(`${Constants.randomNumber}`);
      const adminDataDecrypted = await EncryptDecrypt.decryptUsingAES256(adminDataTemp, key);
      this.adminData = JSON.parse(adminDataDecrypted);

      if (this.adminData) {
        this.router.navigateByUrl('/admin/home', { state: this.adminData });
      }
    }
  }

  ngOnDestroy(): void {
    if (this.bingoServiceSubscription) {
      this.bingoServiceSubscription.unsubscribe();
    }
  }

  RememberMe(checked: boolean) {
    this.rememberAccount = checked;
  }

  async Login() {
    if (this.loginForm.valid) {
      this.bingoServiceSubscription = (await this.newGameService.adminLogin(this.userName, this.password)).subscribe(async data => {
        this.adminData = data;

        if (this.adminData) {
          this.router.navigateByUrl('/admin/home', { state: this.adminData });
          this.loginForm.reset(this.loginForm.value);

          if (this.rememberAccount) {
            this.adminData.password = '';
            let key: any;
            await import('crypto-js')
              .then(module => {
                console.log(module);
                key = module.enc.Utf8.parse(`${Constants.randomNumber}`);
              })
              .catch(err => {
                console.log(err.message);
              });

            //key = CryptoJS.enc.Utf8.parse(`${Constants.randomNumber}`);
            const adminDataEncrypted = await EncryptDecrypt.encryptUsingAES256(this.adminData, key);

            HelperBingo.StoreCardsLocalStorage('wth', adminDataEncrypted);
            HelperBingo.StoreCardsLocalStorage('kamal', new Date().toString());
          }
        }
      },
        error => {
          //console.log(error);
          this._snackBar.open('Invalid user name/password or a server exception occurred, please try again', 'Dismiss', {
            duration: 10000
          });
        });
    }
  }

  ForgotPassword() {
    this.router.navigate(['/admin/forgotPassword']);
  }

  RegisterAccount() {
    this.router.navigate(['/admin/register']);
  }

}
