import React from "react";
import { fetchData1, sleep, useData } from "./handson1";

let sleeping = true

export const Sleep1s: React.VFC = () => {
  if (sleeping) {
    throw sleep(1000).then(() => {
      sleeping = false
    })
  }

  return <p>Hello World</p>
}

export const ShowData: React.VFC<{
  dataKey: number;
}> = ({dataKey}) => {
  const data = useData(`ShowData: ${dataKey}`, fetchData1)
  return (
    <p>
      Data for {dataKey} is {data}
    </p>
  )
}

const formatter = Intl.DateTimeFormat("ja-JP", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  fractionalSecondDigits: 1,
})

export function useTime() {
  const [time, setTime] = React.useState("")

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTime(formatter.format(new Date()))
    }, 100)
    return () => clearInterval(interval)
  }, [])

  return time
}
