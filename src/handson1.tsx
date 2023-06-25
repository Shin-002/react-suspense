import React from "react";

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const AlwaysSuspend: React.FC = () => {
  console.log("AlwaysSuspend is rendered");
  throw sleep(1000)
}

export const SomeTimesSuspend: React.FC = () => {
  if(Math.random() < 0.5) {
    throw sleep(1000)
  }

  return <p>Hello World</p>
}

type Props = {
  name: string
}

export const RenderingNotifier: React.FC<Props> = ({name}) => {
  console.log(`${name} is rendered`)

  return null
}

export async function fetchData1() {
  await sleep(Math.floor(Math.random() * 1000))
  return `Hello, ${(Math.random() * 1000).toFixed(0)}`
}

let data: string | undefined

export const DataLoader1: React.VFC = () => {

  const data = useData('DataLoader1', fetchData1)

  return (
    <div>
      <p>Data is {data}</p>
    </div>
  )
}

export const DataLoader2: React.VFC = () => {

  const data = useData('DataLoader2', fetchData1)

  return (
    <div>
      <p>Data is {data}</p>
    </div>
  )
}

const dataMap: Map<string, Loadable<unknown>> = new Map();

export function useData<T>(cacheKey: string, fetch: () => Promise<T>): T {
  const cachedData = dataMap.get(cacheKey) as Loadable<T> | undefined
  if (cachedData === undefined) {
    const [loadable, promise] = Loadable.newAndGetPromise(fetch())
    dataMap.set(cacheKey, loadable)
    throw promise
  }

  return cachedData.getOrThrow()
}

type LoadableState<T> =
  | {status: 'pending'; promise: Promise<T>}
  | {status: 'fulfilled'; data: T}
  | {status: 'rejected'; error: unknown}

export class Loadable<T> {
  #state: LoadableState<T>;
  constructor(promise: Promise<T>) {
    this.#state = {
      status: 'pending',
      promise: promise.then((data) => {
          this.#state = {status: 'fulfilled', data}
          return data;
        },
        (error) => {
          this.#state = {status: 'rejected', error}
          throw error;
        })
    }
  }

  static newAndGetPromise<T>(promise: Promise<T>): [Loadable<T>, Promise<T>] {
    const result = new Loadable(promise);
    if(result.#state.status !== 'pending') {
      throw new Error('Unreachable')
    }
    return [result, result.#state.promise]
  }

  getOrThrow(): T {
    switch (this.#state.status) {
      case 'pending':
        throw this.#state.promise
      case 'fulfilled':
        return this.#state.data
      case 'rejected':
        throw this.#state.error
    }
  }
}

export const DataLoader: React.VFC<{data: Loadable<string>;}> = ({data}) => {
  const value = data.getOrThrow();
  return (
    <div>
      <div>Data is {value}</div>
    </div>
  )
}
