/*
 * Copyright © 2025 Gavin Sawyer. All rights reserved.
 */

import { isPlatformBrowser, isPlatformServer }                                                                                           from "@angular/common";
import { effect, ExperimentalPendingTasks as PendingTasks, inject, Injectable, makeStateKey, PLATFORM_ID, type StateKey, TransferState } from "@angular/core";
import { distinctUntilChanged, type MonoTypeOperatorFunction, type Observable, type OperatorFunction, startWith, take, tap }             from "rxjs";
import { PathService }                                                                                                                   from "./PathService";


@Injectable({ providedIn: "root" })
export class RxSsrService {

  constructor() {
    if (isPlatformBrowser(this.platformId))
      effect(
        (): void => this.pathService.path$() === this.transferState.get(
          this.pathStateKey,
          undefined,
        ) ? void (0) : this.stateKeys?.forEach(
          (stateKey: StateKey<unknown>): void => this.transferState.remove<unknown>(stateKey),
        ),
      );
    else
      this.transferState.set(
        this.pathStateKey,
        this.pathService.path$(),
      );
  }

  private readonly pathService: PathService         = inject<PathService>(PathService);
  private readonly pathStateKey: StateKey<string>   = makeStateKey<string>("01966901-1a70-7708-8d97-6824a3c35c6a");
  private readonly pendingTasks: PendingTasks       = inject<PendingTasks>(PendingTasks);
  private readonly platformId: NonNullable<unknown> = inject<NonNullable<unknown>>(PLATFORM_ID);
  private readonly transferState: TransferState     = inject<TransferState>(TransferState);

  private stateKeys?: Array<StateKey<unknown>>;

  public useState<Type>(id: string): MonoTypeOperatorFunction<Type> {
    const stateKey: StateKey<Type> = makeStateKey<Type>(id);

    this.stateKeys = [
      ...(this.stateKeys ? [ ...this.stateKeys ] : []),
      stateKey,
    ];

    return (inputObservable: Observable<Type>): Observable<Type> => {
      if (isPlatformServer(this.platformId))
        return inputObservable.pipe<Type, Type>(
          tap<Type>(
            (input: Type): void => this.transferState.set<Type>(
              stateKey,
              input,
            ),
          ),
          take<Type>(1),
        );

      const state: Type | undefined = this.transferState.get<Type | undefined>(
        stateKey,
        undefined,
      );

      if (state !== undefined)
        return inputObservable.pipe<Type, Type>(
          startWith<Type>(state),
          distinctUntilChanged<Type>(),
        );

      return inputObservable;
    };
  }
  public wrap<Type, Result = Type>(
    operatorFunction: OperatorFunction<Type, Result>,
    id: string,
  ): OperatorFunction<Type, Result> {
    const stateKey: StateKey<Result> = makeStateKey<Result>(id);

    this.stateKeys = [
      ...(this.stateKeys ? [ ...this.stateKeys ] : []),
      stateKey,
    ];

    return (inputObservable: Observable<Type>): Observable<Result> => {
      let removeTask: () => void;

      if (isPlatformServer(this.platformId))
        return inputObservable.pipe<Type, Type, Result, Result, Result>(
          distinctUntilChanged<Type>(),
          tap<Type>(
            (): void => {
              removeTask = this.pendingTasks.add();
            },
          ),
          operatorFunction,
          tap<Result>(
            (input: Result): void => {
              setTimeout(removeTask);

              this.transferState.set<Result>(
                stateKey,
                input,
              );
            },
          ),
          take<Result>(1),
        );

      const state: Result | undefined = this.transferState.get<Result | undefined>(
        stateKey,
        undefined,
      );

      if (state !== undefined)
        return inputObservable.pipe<Type, Type, Result, Result, Result, Result>(
          distinctUntilChanged<Type>(),
          tap<Type>(
            (): void => {
              removeTask = this.pendingTasks.add();
            },
          ),
          operatorFunction,
          tap<Result>(
            (): void => {
              setTimeout(removeTask);
            },
          ),
          startWith<Result>(state),
          distinctUntilChanged<Result>(),
        );

      return inputObservable.pipe<Type, Type, Result, Result>(
        distinctUntilChanged<Type>(),
        tap<Type>(
          (): void => {
            removeTask = this.pendingTasks.add();
          },
        ),
        operatorFunction,
        tap<Result>(
          (): void => {
            setTimeout(removeTask);
          },
        ),
      );
    };
  }

}
