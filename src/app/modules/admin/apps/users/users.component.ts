import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { UsersRatracoService } from "app/shared/services/usersRatraco.services";
import { DialogAddUsers } from "./dialog-add-users/dialog-add-users.component";
import Swal from "sweetalert2";

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

    addNewUsers(): void {
      const dialogRef = this.dialog.open(DialogAddUsers, {
        width: '500px',
        disableClose: true
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.usersServices.addUser(result).subscribe({
            next: (response) => {
              // Swal
              debugger
              
              // Có thể refresh danh sách user hoặc thực hiện các hành động khác
            },
            error: (error) => {
              console.error('Lỗi:', error);
              // this.snackBar.open(
              //   error.error?.error || 'Có lỗi xảy ra khi thêm người dùng!',
              //   'Đóng',
              //   {
              //     duration: 3000
              //   }
              // );
            }
          });
        }
      });
    }

    getUsers(){
      this.usersServices.getSheetData("api/users").subscribe(rs =>{
        this.data = rs
      })
    }
  }