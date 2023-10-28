import { Component } from '@angular/core';
import { HttpClient } from "@angular/common/http";    //import
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'AngularExpress';
  userList : any =[];
  udata : any;
  expresponse : string="";
  constructor(private http : HttpClient){
  }
  getAllUsers(){
    this.http.get('http://localhost:8000/getAll').subscribe((response)=>{
      this.userList = response;
      console.log(this.userList);
    });
  }

  
  addUser(udata : any){
    //console.log(udata);
    //console.log(udata.value);
    //this.userList.push(udata.value);
    this.http.post('http://localhost:8000/insert',udata.value).subscribe((response)=>{
    this.expresponse=response.toString();  
    //console.log(response);
    });
  }
  

 
 
}
 