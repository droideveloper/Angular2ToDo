import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/toArray';
import 'rxjs/add/observable/from';

import { TaskState, TaskEntity } from '../entities/entity';

@Injectable()
export class StorageImp {

  private _db: string = "task.db";
  private _instance: Array<TaskEntity>;

  constructor() {
    this._instance = JSON.parse(localStorage.getItem(this._db) || '[]');
  }

  create(text: string): Observable<TaskEntity> {
    const self = this;
    return Observable.of({ text: text, createdAt: new Date(), updatedAt: new Date(), state: TaskState.ACTIVE })
      .map((task: TaskEntity) => self._instance.push(task))
      .map((index) => {
        if (index >= 1) {
          return self._instance[self._instance.length - 1];
        }
        return undefined;
      });
  }

  update(index: number, task: TaskEntity): Observable<TaskEntity> {
    const self = this;
    return Observable.of(task)
      .map((x: TaskEntity) => self._instance.splice(index, 1, x))
      .map( _ => self._instance[index]);
  }

  delete(task: TaskEntity): Observable<TaskEntity> {
    const self = this;
    return Observable.of(task)
      .map((x: TaskEntity) => self._instance.indexOf(x))
      .map((index: number) => self._instance.splice(index, 1))
      .map( _ => task);
  }

  all(): Observable<Array<TaskEntity>> {
    const self = this;
    return Observable.of(self._instance)
      .flatMap((entries) => Observable.from(entries))
      .filter((entry) => entry.state !== TaskState.COMPLETED)
      .toArray();
  }

  persist(): void {
    localStorage.setItem(this._db, JSON.stringify(this._instance));
  }
}