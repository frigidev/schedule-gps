import { Component, ViewChild } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { UserForm } from "../components/user-form";
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../service/user.service';

@Component({
    selector: 'app-tab1',
    templateUrl: 'tab1.page.html',
    standalone: true,
    imports: [IonHeader, IonToolbar, IonTitle, IonContent, ExploreContainerComponent, UserForm]
})
export class Tab1Page {

  constructor(
    private activeRoute: ActivatedRoute,
    private userService: UserService
  ){}

  @ViewChild(UserForm)
  userForm!: UserForm;

  ionViewDidEnter(): void {
    this.userForm.emailToEdit = null;
    const email = this.activeRoute.snapshot.paramMap.get('email');
    if(email){
      this.userService.get(email).then(user => {
        if(user){
          this.userForm.formGroup.patchValue(user);
          this.userForm.emailToEdit = email;
        }
      })
    }
  }
}
