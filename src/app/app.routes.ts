import {Routes} from '@angular/router';
import {UploaderComponent} from './uploader/uploader.component';
import {MembersComponent} from './members/members.component';
import {MemberDetailComponent} from './member-detail/member-detail.component';
import {HomeComponent} from './home/home.component';
import {OrdersComponent} from './orders/orders.component';

export const routes: Routes = [
    { path: '', redirectTo:'/home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'orders', component: OrdersComponent },
    { path: 'members', component: MembersComponent },
    { path: 'upload', component: UploaderComponent },
    { path: 'members/:id', component: MemberDetailComponent, pathMatch: 'full' },
];
