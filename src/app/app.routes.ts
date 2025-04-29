import { Routes } from '@angular/router';
import { DashboardPageComponent } from './dashboard-page/dashboard-page.component';
import { TablePageComponent } from './table-page/table-page.component';

export const routes: Routes = [
  { path: '', component: DashboardPageComponent },
  { path: 'table', loadcomponent: () => TablePageComponent },
];
