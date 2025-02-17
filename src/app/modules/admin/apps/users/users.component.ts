import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { UsersRatracoService } from "app/shared/services/usersRatraco.services";
import { DialogAddUsers } from "./dialog-add-users/dialog-add-users.component";

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss'],
  })
  export class UsersComponent implements OnInit{
    data
    constructor(
      private usersServices: UsersRatracoService,
      private dialog: MatDialog
    ){

    }

    ngOnInit(): void {
        this.getUsers()
    }

    addNewUsers(){
      const dialogRef = this.dialog.open(DialogAddUsers, {
        width: '500px',
        disableClose: true
      });
  
      dialogRef.afterClosed().subscribe(result => {
        debugger
        if (result) {
          console.log('User data:', result);
          // Xử lý dữ liệu người dùng ở đây
        }
      });
    }

    getUsers(){
      debugger
      this.usersServices.getSheetData("api/users").subscribe(rs =>{
        this.data = rs
      })
    }
  }