import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, AlertController, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { UserService } from '../service/user.service';

@Component({
    selector: 'app-user-form',
    templateUrl: 'user-form.html',
    standalone: true,
    imports: [IonicModule, CommonModule, ReactiveFormsModule],
})
export class UserForm {

    @Input()
    modal = false

    formGroup: FormGroup = this.fb.group({
        name: ['', Validators.compose([Validators.pattern(/^[A-Z][A-Za-z\s]{2,25}$/), Validators.required])],
        phone: ['', Validators.compose([Validators.pattern(/^[\d]{9,13}$/), Validators.required])],
        email: ['', Validators.compose([Validators.pattern(/^([\w].+)@([\w]{2,15}).([\w]{2,10})$/), Validators.required])],
        hobbie: ['']
    })

    emailToEdit: string | null = null

    constructor(
        private fb: FormBuilder,
        private userService: UserService,
        private alertController: AlertController,
        private modalController: ModalController
    ){}

    async save(){
        if(this.formGroup.valid){
            if(this.emailToEdit){
                this.userService.edit(this.formGroup.value, this.emailToEdit)
            }else{
                this.userService.create(this.formGroup.value)
            }
            const alert = this.alertController.create({
                header: 'Message',
                message: 'Item saved successfully',
                buttons: ['OK']
            });
            (await alert).onDidDismiss().then((_) => {
                this.formGroup.reset()
                this.close();
            }) 
            await (await alert).present()
        } else{
            const alert = await this.alertController.create({
                header: 'Message',
                message: 'Invalid form',
                buttons: ['OK']
            })
            await alert.present()
        }
    }

    cancel(){
        return this.modalController.dismiss(null, 'cancel');
    }

    close(){
        this.modalController.dismiss(true, 'close');
    }

}