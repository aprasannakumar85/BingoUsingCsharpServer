import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Admin } from 'src/app/shared/models/adminModel';
import { NewGameService } from 'src/app/shared/newgame.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {

  registerForm: boolean = true;
  formPageTitle: string = 'Register Admin account';

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
    //console.log(adminData);
    if (adminData) {
      this.bingoServiceSubscription = this.newGameService.registerAdmin(adminData).subscribe(data => {
        //console.log(data);
        if (data.statusCode === 200) {
          this.router.navigateByUrl('/admin/home', { state: adminData });
        } else {
          this._snackBar.open('there is a server exception or this account might be already taken or an admin account already exists for this team, please try again with a new name or contact hosting team', 'Dismiss', {
            duration: 10000
          });
        }
      },
        error => {
          //console.log(error);
          this._snackBar.open('there is a server exception or this account might be already taken or an admin account already exists for this team, please try again with a new name or contact hosting team', 'Dismiss', {
            duration: 10000
          });
        });
    }
    else {
      this.router.navigate(['/admin']);
      this._snackBar.open('there is a server exception or this account might be already taken or an admin account already exists for this team, please try again with a new name or contact hosting team', 'Dismiss', {
        duration: 10000
      });
    }
  }
}
