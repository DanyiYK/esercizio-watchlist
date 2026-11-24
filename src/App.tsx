import { useEffect, useState } from "react"
import AddShowForm from "@/component/AddShowForm"
import { ShowRow } from "@/component/ShowRow"
import type { Show } from "@/data/watchlist"
import { cn } from "@/utils/cn"
import { Loader2 } from "lucide-react"
import { env } from "@/utils/env"

type Filter = "tutti" | "serie" | "film"


function App() {
  const [nextWatch, setNextWatch] = useState<Show>()
  const [activeFilter, setActiveFilter] = useState<Filter>("tutti")
  const [watchlist, setWatchlist] = useState<Show[]>([])
  const [editingShow, setEditingShow] = useState<Show>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${env.VITE_API_URL}/show`).then(async res => {
      setLoading(false)

      const data = await res.json()

      setWatchlist(prev => [...prev, ...data])
    })
  }, [])

  function OnShowClick(show: Show) {
    if (nextWatch?.id === show.id) {
      setNextWatch(undefined);
    } else {
      setNextWatch(show)
    }
  }

  async function addShow(show: Omit<Show, "id">) {
    const response = await fetch(`${env.VITE_API_URL}/show`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(show)
    })
    const data = await response.json()

    setWatchlist(prev => {
      return [
        ...prev,
        data
      ]
    })
  }

  async function updateShow(show: Show) {
    const response = await fetch(`${env.VITE_API_URL}/show/${show.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(show)
    })

    const data = await response.json()

    // I'm using .map here because I don't want the order of the items to change
    setWatchlist(prev => [...prev.map(value => {
      if (value.id != show.id) return value;

      return data
    })])
  }

  async function deleteShow(show: Show) {
    await fetch(`${env.VITE_API_URL}/show/${show.id}`, {
      method: "DELETE",
    })

    setWatchlist(prev => prev.filter(value => value.id != show.id))
  }

  return (
    <>
      <div className="flex flex-col justify-center items-center p-12">
        <h1 className="font-bold text-4xl text-center">La mia watchlist</h1>
        <div className="flex gap-4 mt-4">

          {["tutti", "serie", "film"].map(filtro =>
            <button
              key={filtro}
              className={cn("px-4 py-2 bg-gray-400 rounded-full", {
                "bg-blue-400": activeFilter === filtro
              })
              }
              onClick={() => setActiveFilter(filtro as Filter)}
            >{filtro}</button>)
          }

        </div>

        <div className="w-xl flex flex-col justify-center items-center gap-4 py-4">
          {loading && <Loader2 className="animate-spin" />}
          {watchlist.filter(show => activeFilter === "tutti" || show.kind === activeFilter).map(show => <ShowRow onDelete={() => deleteShow(show)} onClick={() => OnShowClick(show)} show={show} key={show.id} showUpdated={updateShow} onEdit={() => setEditingShow(show)}></ShowRow>)}
        </div>

        <p>{watchlist.length} titoli: {watchlist.filter(show => show.kind === "film").length} film e {watchlist.filter(show => show.kind === "serie").length} serie</p>
        {nextWatch && <p className="font-bold">Stasera guardo: <span className="capitalize">{nextWatch.title}</span></p>}

        <AddShowForm watchlist={watchlist} defaultValues={editingShow} onSubmit={editingShow ? (showData) => updateShow({ ...showData, id: editingShow.id }) : addShow} />
      </div>

    </>

  )


}

export default App
