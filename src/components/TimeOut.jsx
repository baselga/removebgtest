import { useEffect, useState } from "react"

export const TimeOut = () => {
  const [time, setTime] = useState(0)

  useEffect(() => {
    setTimeout(() => {
      if(time > 99) {
        setTime(0)
      } else {
        setTime(time +1)
      }
    }, 1000);
  }, [time])
  

  return (
    <div className="fixed top-4 right-4 p-2 border rounded-full w-8 h-8 flex items-center justify-center text-xs">
      {time}
    </div>
  )
}