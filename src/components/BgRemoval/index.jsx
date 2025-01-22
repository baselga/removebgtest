import { useState } from "react"
import { removeBackground } from "@imgly/background-removal"
import { TimeOut } from "../TimeOut"
import { Loading } from "../Loading"

const models = /** @type {const} */([
  "isnet",
  "isnet_quint8",
  "isnet_fp16",
])

const devices = /** @type {const} */([
  "cpu",  
  "gpu",
])

/** @typedef {models[number]} Model */
/** @typedef {"cpu" | "gpu"} Device */
/** @typedef {{model: Model, device: Device, proxyToWorker: boolean, processingTime: number }} History */

function BgRemoval() {
  const [model, setModel] = /** @type {typeof useState<Model>} */(useState)("isnet_fp16")
  const [originalImage, setOriginalImage] = useState("")
  const [processedImage, setProcessedImage] = useState("")
  const [processingTime, setProcessingTime] = useState(0)
  const [device, setDevice] = /** @type {typeof useState<Device>} */(useState)("gpu")
  const [proxyToWorker, setProxyToWorker] = useState(false)
  const [debug, setDebug] = useState(false)
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = /** @type {typeof useState<History[]>} */(useState)([])


  console.log("dani history", history)

  return (
    <>
      {loading && <Loading />}
      <TimeOut />
      <div className="h-full grid gap-4 p-4 content-center justify-center justify-items-center">
        <div className="grid grid-cols-[auto_1fr] gap-4">
          <label>Model:</label>
          <select
            className="w-full max-w-36 text-gray-900 px-2 py-1 rounded-md"
            value={model}
            onChange={(e) => {
              const model = /** @type {Model} */(e.target.value)
              setModel(model)
            }}
          >
            {models.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
          <label>Device:</label>
          <select 
            className="w-full max-w-36 text-gray-900 px-2 py-1 rounded-md" 
            onChange={(e) => {
              const deviceValue = /** @type {Device} */(e.target.value)
              setDevice(deviceValue)
            }}
          >
            {devices.map((each) => 
              <option 
                key={each} 
                value={each}
                selected={each === device}
              >{each}</option>
              )}        
          </select>
          <label>Proxy to Worker:</label>
          <input type="checkbox" onChange={e => setProxyToWorker(e.target.checked)} />
          <label>Debug</label>
          <input type="checkbox" onChange={e => setDebug(e.target.checked)} />
        </div>
        <div className="grid grid-cols-[1fr_auto_1fr] p-4 items-center gap-4">
          <img src={originalImage} alt="original image" className="w-[200px] h-auto min-h-[200px] object-center object-contain" />
          <div className="flex flex-col gap-4">
            <label className="px-4 py-2 rounded-md bg-pink-500 text-gray-100 font-bold">
              <input
                type="file"
                className="hidden"
                onChange={(ev) => {
                  const files = ev.target.files
                  if (files) {
                    const url = URL.createObjectURL(files[0])
                    setOriginalImage(url)
                    setProcessedImage("")
                  }
                }}
              />
              Select Image
            </label>            
            <button
              className="px-4 py-2 rounded-md bg-sky-500 text-gray-100 font-bold"
              onClick={async () => {
                const start = performance.now()
                setLoading(true)
                try {
                  const processedData = await removeBackground(originalImage, {                    
                    model,
                    proxyToWorker,
                    device,
                    debug,
                    progress: (progress) => {
                      console.log("PROGRESS",progress)
                    },
                  })
                  const end = performance.now()
                  setProcessingTime(end - start)
                  const processedUrl = URL.createObjectURL(processedData)
                  setProcessedImage(processedUrl)
                  setLoading(false)
                  setHistory([{model, device, proxyToWorker, processingTime: end - start}, ...history])
                } catch {
                  setLoading(false)
                }
              }}
            >
              Process Image
            </button>
          </div>
          <img src={processedImage} alt="processed image" className="w-[200px] h-auto min-h-[200px] object-center object-contain" />
        </div>
        <div className="self-start justify-self-center">
          <p>Processing time: {Math.round(processingTime / 1000)}s</p>
        </div>
        <div className="grid grid-cols-4 border border-gray-500">
          <div className="border border-gray-500 py-2 px-4 text-center">Model</div>
          <div className="border border-gray-500 py-2 px-4 text-center">Device</div>
          <div className="border border-gray-500 py-2 px-4 text-center">Proxy</div>
          <div className="border border-gray-500 py-2 px-4 text-center">Time</div>
          {history.map((each) => (
            <>
            <div className="border border-gray-500 py-2 px-4 text-center">{each.model}</div>
            <div className="border border-gray-500 py-2 px-4 text-center">{each.device}</div>
            <div className="border border-gray-500 py-2 px-4 text-center">{each.proxyToWorker ? "true" : "false"}</div>
            <div className="border border-gray-500 py-2 px-4 text-center">{Math.round(each.processingTime / 1000)}s</div>
            </>
          ))}
        </div>
      </div>
    </>
  )
}

export default BgRemoval