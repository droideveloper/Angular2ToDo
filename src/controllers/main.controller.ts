import { Component, OnInit, OnDestroy } from '@angular/core';
import { ENTER } from '@angular/material';

import { TaskEntity, TaskState } from '../entities/entity';
import { StorageImp } from '../commons/storage';

import { Observable } from 'rxjs/Observable';

interface State {
  title: string;
  selected: boolean;
}

@Component({
  selector: 'main-view',
  templateUrl: '../views/main.html'
})
export class MainController implements OnInit, OnDestroy {
    text: string;
    dataSet: Array<TaskEntity>;

    states: Array<State>;

    public TaskState = TaskState;
    private _keyEnter = 13;

    activeCount: number;
    inactiveCount: number;

    constructor(private _storage: StorageImp) { }

    ngOnInit() {
      const self = this;
      self.activeCount = 0;
      self.inactiveCount = 0;

      this.states = [
       { title: 'ALL', selected: true },
       { title: 'ACTIVE', selected: false },
       { title: 'INACTIVE', selected: false }];

      this._storage.all()
        .subscribe((x) => {
          self.dataSet = x;
        });
    }

    ngOnDestroy() {
      this._storage.persist();
    }

    onkey(event: KeyboardEvent) {
      const isEnterPressed = (event.keyCode === ENTER);
      if (isEnterPressed) {
        if (this.text || '') {
          const self = this;
          this._storage.create(this.text)
            .subscribe(entry => {
              const activeState = self.states.find(x => x.selected);
              if (activeState.title !== 'INACTIVE') {
                self.dataSet.push(entry);
              }
              self.calcActiveAndInactiveCount();
              self.text = null;
              if (event.target instanceof HTMLElement) {
                const input =  (event.target as HTMLElement);
                if (input) {
                  input.blur();
                }
              }
          });
        }
      }
    }

    onstate(index: number, task: TaskEntity) {
      task.state = task.state === TaskState.ACTIVE ? TaskState.INACTIVE : TaskState.ACTIVE;
      this.dataSet[index] = task;
      // notify
      this.calcActiveAndInactiveCount();
    }

    filterContent(state: State, index: number) {
      this.states = this.states.map(s => {
         s.selected = false;
         return s;
      });

      state.selected = true;
      this.states[index] = state;

      const self = this;
      self._storage.all()
        .flatMap(entries => Observable.from(entries))
        .filter(entry => {
          if (state.title === 'ALL') {
            return entry.state !== TaskState.COMPLETED;
          } else if (state.title === 'ACTIVE') {
            return entry.state === TaskState.ACTIVE;
          } else if (state.title === 'INACTIVE') {
            return entry.state === TaskState.INACTIVE;
          }
          return true;
       }).toArray()
         .subscribe((entries) => {
            self.dataSet = entries;
            self.calcActiveAndInactiveCount();
        }, err => {
           self.dataSet = [];
           self.calcActiveAndInactiveCount();
        });
    }

    clearTask(): void {
      const self = this;
      Observable.from(this.dataSet)
        .map((s) => {
           if (s.state === TaskState.INACTIVE) {
             s.state = TaskState.COMPLETED;
           }
           return s;
        }).filter(s => s.state === TaskState.ACTIVE)
         .toArray()
         .subscribe((entries) => {
           self.dataSet = entries;
           self.calcActiveAndInactiveCount();
         }, err => {
           self.dataSet = [];
           self.calcActiveAndInactiveCount();
         });
    }

    clearCurrent(index: number, task: TaskEntity): void {
      const self = this;
      task.state = TaskState.COMPLETED;
      this.dataSet[index] = task;
      Observable.from(this.dataSet)
        .filter(x => x.state !== TaskState.COMPLETED)
        .toArray()
        .subscribe((entries) => {
           self.dataSet = entries;
           self.calcActiveAndInactiveCount();
        }, error => {
           self.dataSet = [];
           self.calcActiveAndInactiveCount();
        });
    }

    private calcActiveAndInactiveCount(): void {
      this.activeCount = (this.dataSet || []).filter(x => x.state === TaskState.ACTIVE).length;
      this.inactiveCount = (this.dataSet || []).filter(x => x.state === TaskState.INACTIVE).length;
    }
}