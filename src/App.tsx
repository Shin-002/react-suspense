import './App.css'
import React, { useState, Suspense, startTransition, useTransition } from "react";
import { ShowData, Sleep1s, useTime } from "./handson2";
const Loading: React.VFC = () => {
  return <p>Loading...</p>
}

function App() {
  const [counter, setCounter] = useState(0)
  const time = useTime()
  const [isPending, startTransition] = useTransition();
  const [isPending2, startTransition2] = useTransition();
  return (
    <div className="text-center">
      <h1 className="text-2xl">React App!</h1>
      <p className={"tabular-nums " + (isPending ? "text-blue-700" : "")}>🕐 {time}</p>
      <Suspense fallback={<Loading/>}>
        <ShowData dataKey={counter}/>
      </Suspense>
      <p>
        <button
          // スタイルをつける（ボーダー、パディング、角丸）
          className="border border-gray-500 p-1 rounded-md"
          onClick={() => {
            startTransition(() => {
              setCounter((c) => c + 1)
            })
            startTransition2(() => {
              setCounter((c) => c + 5);
            });
          }}
        >
          Counter is {counter}
        </button>
      </p>
    </div>
  )
}

export default App
