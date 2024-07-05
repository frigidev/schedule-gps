import { Component, ViewChild } from '@angular/core';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { User } from '../model/user';
import { UserService } from '../service/user.service';
import { IonicModule, ToastController, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { UserForm } from '../components/user-form';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonicModule, ExploreContainerComponent, CommonModule, ReactiveFormsModule, ScrollingModule]
})
export class Tab2Page {

  constructor(
    private userService: UserService,
    private router: Router,
    private fb: FormBuilder,
    private toastController: ToastController,
    private modalController: ModalController
  ) {}

  users: User[] = [];

  isLoading = false;

  subscriptions: Subscription[] = []

  errorName = false;

  errorPhone = false;

  searchBarName = false;

  searchBarPhone = false;

  searchButtons = true;

  filterFormName = this.fb.group({
    name: ['']
  });

  filterFormPhone = this.fb.group({
    phone: [''] 
  })

  ionViewDidEnter(): void {
    this.list();

    const sName = this.filterFormName.valueChanges
    .pipe(
      debounceTime(300),
      distinctUntilChanged()
    )
    .subscribe(value => this.filterName(value.name!))
    this.subscriptions.push(sName)

    const sPhone = this.filterFormPhone.valueChanges
    .pipe(
      debounceTime(300),
      distinctUntilChanged()
    )
    .subscribe(value => this.filterPhone(value.phone!))
    this.subscriptions.push(sPhone)
  }

  ionViewWilLeave(): void { 
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  emptyName(){
    if(this.filterFormName.controls['name'].value === ''){
      this.errorName = true;
    }

    addEventListener('keydown', () => {
      if(this.filterFormName.controls['name'].value === ''){
        this.errorName = true;
      }
    })

    addEventListener('keypress', () => {
      this.errorName = false;
    })

    addEventListener('ionBlur', () => {
      this.errorName = false;
    })
  }

  emptyPhone(){
    if(this.filterFormPhone.controls['phone'].value === ''){
      this.errorPhone = true;
    }

    addEventListener('keydown', () => {
      if(this.filterFormPhone.controls['phone'].value === ''){
        this.errorPhone = true;
      }
    })

    addEventListener('keypress', () => {
      this.errorPhone = false;
    })

    addEventListener('ionBlur', () => {
      this.errorPhone = false;
    })
  }

  goBack(){
    this.searchBarName ? this.filterFormName.reset()
     : this.filterFormPhone.reset();
    this.searchButtons = true;
    this.searchBarName = false;
    this.searchBarPhone = false;
    this.list();
  }

  showSearchBarName(){
    this.searchBarName = true;
    this.searchButtons = false;
  }

  showSearchBarPhone(){
    this.searchBarPhone = true;
    this.searchButtons = false;
  }

  list(){
    this.isLoading = true;
    setTimeout(() => {
      this.userService.list().then(data => {
        if(data){
          this.users = data;
        }
        this.isLoading = false;
      })
    }, 500)
  }

  edit(user: User){
    this.router.navigate(['tabs/tab1', user.email])
  }

  async delete(user: User){
    const deleted = await this.userService.delete(user.email)
    if(deleted){
      this.list()

      const toast = await this.toastController.create({
        header: 'Deleting...',
        message: 'User deleted successfully',
        duration: 2000,
        position: 'top'
      })

      await toast.present();
    }
  }

  async filterName(name: string){
    const users = await this.userService.findByName(name);
    this.users = users;
  }

  async filterPhone(phone: string){
    const users = await this.userService.findByPhone(phone);
    this.users = users;
  }

  async createNew() {
    const toastCreateNew = await this.toastController.create({
      message: "Create a new user",
      duration: 250,
      position: 'top'
    })
    await toastCreateNew.present();

    const modal = await this.modalController.create({
      component: UserForm,
      componentProps: {modal: true}
    })

    await modal.present();
    const {data, role} = await modal.onDidDismiss()
    if(role === 'close'){
      this.list();
    }else if (role === 'cancel'){
      const toastBack = await this.toastController.create({
        message: "Back to the list",
        duration: 250,
        position: 'top'
      })
      await toastBack.present();
    }
  }

}