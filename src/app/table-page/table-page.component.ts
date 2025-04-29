import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { interval, Subscription } from 'rxjs';

interface RowData {
  sNo: number;
  name: string;
  age: number;
}

@Component({
  selector: 'app-table-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table-page.component.html',
  styleUrl: './table-page.component.scss'
})
export class TablePageComponent {
  sessionStartTime: Date = new Date();
  sessionTime: string = '00:00:00';
  activeTime: string = '00:00:00';
  lastInteractionTime: Date = new Date();
  isIdle: boolean = false;
  overlayVisible: boolean = false;
  sessionTimerSubscription: Subscription | undefined;
  activeTimerSubscription: Subscription | undefined;
  users: RowData[] = [];
  nextSNo = 1;
  names = ['Jacob', 'Michael', 'Ethan', 'Joshua', 'Daniel', 'Alexander', 'Anthony', 'William'];
 

  constructor() {}

  ngOnInit(): void {
    this.onStartTimer();
    this.generateInitialData(5);
  }

  onStartTimer() {
    this.sessionTimerSubscription = interval(1000).subscribe(() => {
      this.sessionTime = this.formatTime(this.sessionStartTime);
    });

     this.activeTimerSubscription = interval(1000).subscribe(() => {
      if (!this.isIdle) {
        this.activeTime = this.formatTime(this.lastInteractionTime);
      }
    });
  }

  stopTimers() {
    if (this.sessionTimerSubscription) {
      this.sessionTimerSubscription.unsubscribe();
    }
    if (this.activeTimerSubscription) {
      this.activeTimerSubscription.unsubscribe();
    }
  }

  formatTime(pastdate: Date): string {
    const totalSeconds: number = Math.floor(
      (new Date().getTime() - pastdate.getTime()) / 1000
    )
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (num: number): string => {
      return num < 10 ? '0' + num : '' + num;
    };
    
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }

  pad(num: number): string {
    return num < 10 ? '0' + num : '' + num;
  }

  generateRandomRow(): RowData {
    return {
      sNo: this.nextSNo++,
      name: this.names[Math.floor(Math.random() * this.names.length)],
      age: Math.floor(Math.random() * (60 - 20 + 1)) + 20,
    };
  }

  generateInitialData(count: number) {
    for (let i = 0; i < count; i++) {
      this.users.push(this.generateRandomRow());
    }
  }

  addRow() {
    this.users.push(this.generateRandomRow());
  }

  deleteRow() {
    if (this.users.length > 0) {
      const randomIndex = Math.floor(Math.random() * this.users.length);
      this.users.splice(randomIndex, 1);
    }
  }

  @HostListener('document:mousemove')
  resetIdleTimer() {
    this.isIdle = false;
    this.overlayVisible = false;
    this.lastInteractionTime = new Date();
    this.checkIdle();
  }

  checkIdle() {
    setTimeout(() => {
      const idleTime =
        new Date().getTime() - this.lastInteractionTime.getTime();
      if (idleTime >= 30000) {
        this.isIdle = true;
        this.overlayVisible = true;
      } else if (!this.isIdle) {
        this.checkIdle();
      }
    }, 1000);
  }

  @HostListener('document:click')
  resumeSession() {
    if (this.isIdle) {
      this.resetIdleTimer(); // Restart the idle check
    }
  }

  ngAfterViewInit(): void {
    this.checkIdle(); // Start the idle check after the view is initialized
  }

  
  ngOnDestroy(): void {
    this.stopTimers();
  }
}
