import { Component, OnInit } from "@angular/core";
import { UsersRatracoService } from "app/shared/services/usersRatraco.services";

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss'],
  })
  export class UsersComponent implements OnInit{
    data
    constructor(
      private usersServices: UsersRatracoService
    ){

    }

    ngOnInit(): void {
        this.getUsers()
    }

    addNewUsers(){

    }

    getUsers(){
      debugger
      this.usersServices.getSheetData("api/users").subscribe(rs =>{
        this.data = rs
      })
    }
  }