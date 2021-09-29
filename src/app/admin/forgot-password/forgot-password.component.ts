import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Admin } from 'src/app/shared/models/adminModel';
import { NewGameService } from 'src/app/shared/newgame.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {

  forgotPasswordForm: boolean = false;
  formPageTitle: string = 'Reset Password';

  bingoServiceSubscription: any;

  constructor(private router: Router, private newGameService: NewGameService, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    if (this.bingoServiceSubscription) {
      this.bingoServiceSubscription.unsubscribe();
    }
  }

  onValueChange(adminData: Admin): void {
    if (adminData) {
      this.bingoServiceSubscription = this.newGameService.resetAdmin(adminData, "true").subscribe(data => {
        //console.log(data);
        if (data.status === 200) {
          this.router.navigateByUrl('/admin/home', { state: data.admin });
        } else {
          this._snackBar.open('there is a server exception, please contact  hosting team', 'Dismiss', {
            duration: 10000
          });
        }
      },
        error => {
          //console.log(error);
          this._snackBar.open('there is a server exception, please contact  hosting team', 'Dismiss', {
            duration: 10000
          });
        });
    }
    else {
      this.router.navigate(['/admin']);
      this._snackBar.open('there is an exception occurred, please contact  hosting team', 'Dismiss', {
        duration: 10000
      });
    }
  }

}
